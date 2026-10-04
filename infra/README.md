# infra — EC2 서버 셋업 & 배포

`client/`(Next.js)를 EC2(Ubuntu)에 올리는 스크립트 모음이다. `dev` / `prod` 두 타겟을 지원한다.

**핵심 한 줄:** 빌드는 **내 노트북에서** 하고, 서버에는 **결과물만** 올린다.
서버 메모리가 작아도 되고, 서버에 소스 코드나 git 체크아웃을 둘 필요도 없다.

```
[내 노트북]                                  [EC2 서버]
 yarn build:release  ──rsync─→  .next / public / package.json ...
                                        │
                                        ├─ yarn install --production
                                        ├─ pm2 → next start (:3000)
                                        └─ nginx :80/:443 → :3000
```

모든 스크립트는 **로컬에서** 실행한다. 스크립트가 알아서 SSH로 서버에 명령을 보낸다.
서버에 직접 접속해서 뭔가 할 일은 (디버깅 빼면) 없다.

---

# 처음 셋팅하기

`prod` 기준으로 적었다. dev는 명령어의 `prod`를 `dev`로 바꾸면 된다.
**dev와 prod가 서로 다른 서버라면, 각 서버마다 STEP 0~2와 STEP 5를 따로 한 번씩** 해준다.

## STEP 0. EC2 인스턴스 준비 (AWS 콘솔)

1. **인스턴스 생성** — Ubuntu 22.04 또는 24.04, 아키텍처는 x86_64
   - 타입은 t3.small 이상 권장. 빌드를 로컬에서 하므로 서버는 실행만 감당하면 된다
2. **키 페어** — 새로 만들고 `.pem` 파일을 다운로드한다
3. **보안 그룹** — 인바운드에 **22(SSH), 80(HTTP), 443(HTTPS)** 을 연다
4. **Elastic IP 연결** — 아래 [IP 고정](#ip-고정-elastic-ip) 참고. 도메인을 붙일 거라면 지금 해두는 게 좋다

받은 pem 키는 **`infra/secrets/` 에 둔다.** 시크릿이 한곳에 모이고, `.gitignore`가 커밋을 막아준다.

```bash
mv ~/Downloads/crewwiki-fe-prod.pem infra/secrets/
chmod 400 infra/secrets/crewwiki-fe-prod.pem
```

접속이 되는지 먼저 확인한다. **여기서 접속이 안 되면 다음 단계는 전부 실패한다.**

```bash
ssh -i infra/secrets/crewwiki-fe-prod.pem ubuntu@<서버IP>   # 접속되면 exit 로 나온다
```

## STEP 1. 설정 파일 만들기 (최초 1회)

```bash
cd infra

cp .env.example .env                            # 서버 접속 정보
cp secrets/dev.env.example  secrets/dev.env     # dev 앱 환경변수
cp secrets/prod.env.example secrets/prod.env    # prod 앱 환경변수
chmod +x *.sh lib/*.sh
```

이 파일들과 `secrets/*.pem`은 전부 **커밋되지 않는다** (`.gitignore`가 막는다).
팀원에게는 안전한 경로로 따로 전달한다.

### `.env` 채우기 — 서버가 어디 있나

```bash
SSH_KEY=secrets/crewwiki-fe-prod.pem  # infra/ 기준 상대경로 (절대경로나 ~ 도 가능)
APP_DIR=/srv/app                      # 서버에서 앱이 살 디렉토리 (그대로 둬도 된다)
APP_PORT=3000                         # client/ecosystem.config.js 의 env.PORT 와 같아야 한다

PROD_SERVER_USER=ubuntu
PROD_SERVER_HOST=13.x.x.x             # STEP 0의 서버 IP
PROD_DOMAIN=                          # SSL 붙일 때만. 예: wiki.example.com
PROD_CERTBOT_EMAIL=                   # 인증서 만료 알림 받을 메일
```

dev와 prod의 키가 다르면 타겟별로 지정한다. 타겟별 값이 공통 `SSH_KEY`보다 우선한다.

```bash
DEV_SSH_KEY=secrets/crewwiki-fe-dev.pem
PROD_SSH_KEY=secrets/crewwiki-fe-prod.pem
```

`www` 같은 서브도메인도 함께 받으려면 `*_DOMAIN_ALIASES`에 공백으로 구분해 적는다.
nginx `server_name`과 인증서(SAN)에 **함께** 들어간다.

```bash
DEV_DOMAIN=dev.crew-wiki.site
DEV_DOMAIN_ALIASES=www.dev.crew-wiki.site
```

### `secrets/prod.env` 채우기 — 앱이 쓸 값

`NEXT_PUBLIC_*` 7개와 `VIEW_DATA_*` 2개, `SENTRY_AUTH_TOKEN`. 값은 기존
GitHub Actions Secrets 또는 `client/.env.local`에서 가져오면 된다.

> ⚠️ **`KEY=VALUE`로 공백 없이** 쓴다. 이 파일은 셸이 `source`로 읽기 때문에
> `KEY = VALUE`(등호 옆 공백)는 에러가 난다. `client/.env.local`을 그대로 복사하면
> 공백 스타일이라 깨지니 주의.

## STEP 2. 서버 세팅 (서버당 1회)

```bash
./bootstrap.sh prod
```

서버에 swap 2GB, Node 22, yarn 1, pm2, nginx, certbot을 설치하고 nginx 리버스 프록시를 건다.
여러 번 실행해도 안전하다 (이미 설치된 건 건너뛴다).

끝에 `node -v / yarn -v / pm2 -v`가 찍히면 성공이다.

## STEP 3. 첫 배포

실제로 올리기 전에 **리허설**을 먼저 돌릴 수 있다. 서버를 전혀 건드리지 않는다.

```bash
DRY_RUN=1 ./deploy.sh prod
```

접속·키·env 검증 → 로컬 빌드 → `rsync --dry-run`(올라갈 파일 목록만 출력) → 서버에서 실행됐을 명령 출력.
빌드가 오래 걸려 답답하면 두 번째부터는 `SKIP_BUILD=1 DRY_RUN=1 ./deploy.sh prod`로 기존 `.next`를 재사용한다.

문제없으면 실제 배포:

```bash
./deploy.sh prod
```

순서대로 이런 일이 일어난다:

1. 로컬에서 `yarn install` → `secrets/prod.env`를 주입한 채 `yarn build:release`
2. 빌드 결과물을 서버 `$APP_DIR`로 rsync
3. 앱 env를 서버에 업로드 (`prod` → `.env.production`, `dev` → `.env.local`)
4. 서버에서 프로덕션 의존성 설치 → `pm2 startOrReload`

몇 분 걸린다. 끝나면 브라우저에서 **`http://<서버IP>`** 로 접속된다.

## STEP 4. 도메인 연결 (DNS)

도메인 관리 콘솔에서 **A 레코드**를 서버 IP로 연결한다. 전파에 몇 분~수십 분 걸린다.

```bash
dig +short wiki.example.com     # 서버 IP가 나오면 전파 완료
```

## STEP 5. HTTPS 붙이기 (도메인당 1회)

**STEP 4의 전파가 끝난 뒤에** 실행한다. 전파 전에 실행하면 인증서 발급이 실패한다.

```bash
./setup-ssl.sh prod
```

Let's Encrypt 인증서를 발급하고, HTTP→HTTPS 리다이렉트를 걸고, 매주 월요일 03:00 자동 갱신을 등록한다.
끝나면 **`https://wiki.example.com`** 으로 접속된다.

> Let's Encrypt는 도메인별 주간 발급 한도가 있다. 발급/삭제를 반복하며 테스트할 거라면
> `setup-ssl.sh`의 certbot 명령에 `--staging`을 붙여 연습용 인증서로 먼저 확인한다.

## 요약 — 명령어만

```bash
# 최초 1회
cd infra
cp .env.example .env && cp secrets/prod.env.example secrets/prod.env
chmod +x *.sh lib/*.sh
vi .env                 # 서버 IP, 키 경로 채우기
vi secrets/prod.env     # 앱 환경변수 채우기

./bootstrap.sh prod     # 서버 세팅
./deploy.sh prod        # 배포          → http://<IP>
# (DNS A 레코드 연결 후)
./setup-ssl.sh prod     # HTTPS         → https://<도메인>
```

---

# 그 다음부터는

코드가 바뀔 때마다 **이 한 줄이 전부다.**

```bash
cd infra && ./deploy.sh prod
```

`bootstrap.sh`와 `setup-ssl.sh`는 다시 실행할 필요가 없다 (실행해도 안전하긴 하다).

---

# 알아두면 좋은 것

## 스크립트 4개

| 스크립트 | 언제 | 하는 일 |
| --- | --- | --- |
| `bootstrap.sh <dev\|prod>` | 서버당 1회 | swap/Node 22/yarn1/pm2/nginx/certbot 설치 + nginx 프록시 |
| `deploy.sh <dev\|prod> [경로]` | 배포할 때마다 | 로컬 빌드 → 업로드 → pm2 재시작 (경로 기본값 `../client`) |
| ↳ `DRY_RUN=1` | 미리 확인할 때 | 서버를 바꾸지 않고 접속·빌드·업로드 목록만 검증 |
| ↳ `SKIP_BUILD=1` | 반복 확인할 때 | 기존 `.next` 재사용 (빌드 생략) |
| `setup-ssl.sh <dev\|prod>` | 도메인당 1회 | 인증서 발급 + 자동 갱신 등록 |
| `reset.sh <dev\|prod>` | 필요할 때 | 배포물·설정 초기화 (패키지는 유지) |

## 환경변수는 두 시점에 읽힌다

이걸 모르면 "값을 바꿨는데 왜 안 바뀌지?"에서 막힌다.

- **`NEXT_PUBLIC_*`** — **빌드 시점**에 번들 안에 문자열로 박제된다.
  서버에서 `.env`를 고쳐도 클라이언트 화면은 안 바뀐다. **다시 배포해야 한다.**
- **접두사 없는 변수** (`VIEW_DATA_*` 등) — **서버 실행 시점**에 읽힌다.

`deploy.sh`가 두 시점을 모두 같은 파일(`secrets/<타겟>.env`)로 맞춘다.
단 `SENTRY_AUTH_TOKEN`은 빌드에만 필요하므로 서버로 올리지 않는다.

## 서버로 올라가는 파일

| 대상 | 이유 |
| --- | --- |
| `.next` (`cache` 제외) | 빌드 결과물 |
| `package.json`, `yarn.lock` | 서버에서 프로덕션 의존성 설치 |
| `public` | 정적 파일 |
| `ecosystem.config.js` | pm2 실행 정의 |
| `next.config.ts`, `tsconfig.json`, `src/constants` | `next start`가 런타임에 config를 로드한다. config가 `@constants/urls`를 import 하므로 alias 해석용 `tsconfig.json`과 그 소스가 필요하다 |

`--delete`로 `.next`·`public` 안의 옛 산출물은 정리되지만, 아래는 `--exclude`로 보호된다 —
서버에서만 만들어지고 유지돼야 하는 것들이다.

- `node_modules` — 서버에서 설치
- `.env*` — 배포 단계에서 따로 업로드
- **`src/data`** — 조회수 데이터. 배포해도 유실되지 않는다
- `.next/cache` — 런타임 캐시

## pm2 설정은 client가 소유한다

프로세스 이름(`crew-wiki`), 실행 명령, 포트는 [client/ecosystem.config.js](../client/ecosystem.config.js)에 있다.
`.env`의 `APP_PORT`는 거기 `env.PORT`와 **같은 값**이어야 nginx 프록시가 맞는다.

dev/prod 모두 프로덕션 빌드를 `next start`로 띄우므로 `NODE_ENV`는 항상 `production`이다.
타겟별 차이는 서버에 올라가는 env 파일이 가진다.

---

# 문제가 생겼을 때

**먼저 서버 로그부터 본다.**

```bash
ssh -i secrets/crewwiki-fe-prod.pem ubuntu@<IP>
pm2 status          # 프로세스가 살아있나 (online / errored)
pm2 logs --lines 50 # 앱 에러 로그
sudo nginx -t       # nginx 설정 문법
```

| 증상 | 원인 / 해결 |
| --- | --- |
| `.env 파일이 없습니다` | STEP 1을 건너뛰었다. `cp .env.example .env` |
| `SSH 키를 찾을 수 없습니다` | pem을 `infra/secrets/`에 두고 `.env`에 `SSH_KEY=secrets/<파일>.pem`으로 적었는지 확인 |
| `SSH 키 권한이 너무 열려 있습니다` | `chmod 400 infra/secrets/<파일>.pem` |
| `Permission denied (publickey)` | 키는 맞는데 서버/유저가 다르다. `SERVER_USER`(보통 `ubuntu`)와 `SERVER_HOST` 확인 |
| 배포는 됐는데 502 Bad Gateway | 앱이 안 떠 있다. `pm2 logs`로 확인. `APP_PORT` ≠ `ecosystem.config.js`의 `PORT`인 경우도 많다 |
| 화면의 API 주소가 옛날 값 | `NEXT_PUBLIC_*`은 빌드에 박제된다. `secrets/*.env` 고치고 **재배포** |
| `source: ... not found` 류 에러 | `secrets/*.env`에 `KEY = VALUE`처럼 공백이 들어갔다 |
| 이미지 업로드 시 413 | nginx `client_max_body_size`(현재 20m) 초과. 템플릿에서 올린 뒤 `bootstrap.sh` 재실행 |
| certbot 발급 실패 | DNS A 레코드 전파가 안 끝났다. `dig +short <도메인>` 확인 후 재시도 |
| 조회수가 초기화됨 | `reset.sh`를 돌렸다. `deploy.sh`는 `src/data`를 보존한다 |

---

# 초기화 (재테스트용)

배포물을 밀고 처음부터 다시 해볼 때 쓴다. 인스턴스를 끄지 않으므로 IP는 유지되고,
설치된 패키지(Node/nginx 등)도 남는다.

```bash
./reset.sh dev
#   확인(y/N) 후:
#   - pm2 프로세스 제거 (pm2 delete all — 인스턴스당 앱 1개 전제)
#   - 앱 디렉토리 내용 삭제 (env, 조회수 데이터 src/data 포함)
#   - SSL 인증서/갱신 crontab 정리
```

> ⚠️ **조회수 데이터가 지워진다.** 운영 서버라면 먼저 백업:
> `scp -i secrets/<키>.pem ubuntu@<IP>:/srv/app/src/data/* ./backup/`

`reset.sh`는 `certbot delete` 뒤에 nginx를 reload하지 않는다. 삭제된 인증서를 가리키는 설정을
다음 `bootstrap.sh`가 HTTP 버전으로 덮어써 바로잡기 때문이다.

초기화 후 재배포는 처음과 같다:

```bash
./bootstrap.sh dev && ./deploy.sh dev && ./setup-ssl.sh dev
```

---

# IP 고정 (Elastic IP)

자동 할당된 퍼블릭 IP는 인스턴스를 **종료/중지하면 바뀐다.** (재부팅은 괜찮다.)
도메인이나 화이트리스트에 IP를 등록할 거라면 Elastic IP를 붙여둔다.

1. EC2 콘솔 → Network & Security → Elastic IPs → **Allocate**
2. 할당한 EIP → **Associate** → 대상 인스턴스 선택

자동 할당 IP를 같은 값 그대로 EIP로 전환할 수는 없다. EIP를 새로 연결하면 IP가 **한 번 바뀌고**
그 뒤로 고정된다. 그래서 도메인을 붙이기 전에 하는 게 편하다. 실행 중 인스턴스에 붙어 있으면 무료다.

---

# 파일 구조

```
infra/
├── .env.example                  # 서버/타겟 설정 (DEV_*, PROD_*)
├── .gitignore                    # .env, secrets/*.env, *.pem 차단
├── bootstrap.sh                  # 서버 셋업 (1회)
├── deploy.sh                     # 배포 (매번)
├── setup-ssl.sh                  # SSL (도메인당 1회)
├── reset.sh                      # 배포물 초기화
├── lib/load-env.sh               # .env 로드 + 타겟 값 해석/검증 + nginx 템플릿 렌더링
├── remote/
│   ├── server-setup.sh           # SSH로 서버에 흘려보내는 설치 스크립트
│   └── nginx-app.conf.template   # 도메인/포트 치환용 nginx 설정
├── secrets/                      # 시크릿은 전부 여기 (예제 파일만 커밋)
│   ├── dev.env.example           # 복사해서 dev.env (커밋 X)
│   ├── prod.env.example          # 복사해서 prod.env (커밋 X)
│   └── *.pem                     # SSH 키 (커밋 X)
└── README.md
```

**커밋함:** 스크립트, `remote/*`, `*.example`, `README.md`
**커밋 안 함:** `.env`, `secrets/*.env`, `secrets/*.pem` — `.gitignore`가 막는다
