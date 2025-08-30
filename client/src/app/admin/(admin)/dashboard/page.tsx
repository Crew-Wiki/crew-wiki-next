'use client';

export default function AdminDashboardPage() {
  // 더미 데이터
  const userAndDocumentStats = {
    totalUsers: 1234,
    todayUsers: 56,
    todayCreateDocuments: 7,
    totalDocuments: 890,
  };

  const recentActivities = [
    {id: 1, user: '쿠키', action: '문서 생성', document: 'React Hook 정리', time: '10분 전'},
    {id: 2, user: '토다리', action: '문서 수정', document: 'TypeScript 기초', time: '15분 전'},
    {id: 3, user: '프룬', action: '문서 조회', document: '우테코 회고', time: '30분 전'},
    {id: 4, user: '루나', action: '문서 생성', document: 'TDD 실습', time: '1시간 전'},
    {id: 5, user: '김이박', action: '문서 수정', document: '선릉 맛집 추천', time: '2시간 전'},
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-bm text-2xl text-grayscale-text">대시보드</h1>

      {/* 통계 자료 - 콘텐츠는 생각 필요 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-grayscale-200 bg-white p-6">
          <h3 className="font-pretendard text-sm text-grayscale-600">전체 방문자</h3>
          <p className="mt-2 font-bm text-3xl text-grayscale-900">{userAndDocumentStats.totalUsers.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-grayscale-200 bg-white p-6">
          <h3 className="font-pretendard text-sm text-grayscale-600">오늘 방문자</h3>
          <p className="mt-2 font-bm text-3xl text-grayscale-900">{userAndDocumentStats.todayUsers.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-grayscale-200 bg-white p-6">
          <h3 className="font-pretendard text-sm text-grayscale-600">오늘 생성된 문서</h3>
          <p className="mt-2 font-bm text-3xl text-grayscale-900">
            {userAndDocumentStats.todayCreateDocuments.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-grayscale-200 bg-white p-6">
          <h3 className="font-pretendard text-sm text-grayscale-600">전체 문서</h3>
          <p className="mt-2 font-bm text-3xl text-grayscale-900">
            {userAndDocumentStats.totalDocuments.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 차트 영역 - 그래프 */}
      <div className="rounded-lg border border-grayscale-200 bg-white p-6">
        <h2 className="mb-4 font-bm text-lg text-grayscale-text">사용자 활동 추이</h2>
        <div className="flex h-64 items-center justify-center bg-grayscale-50">
          <p className="font-pretendard text-sm text-grayscale-400">여기에 차트가 들어갑니다. (추후 구현)</p>
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="rounded-lg border border-grayscale-200 bg-white p-6">
        <h2 className="mb-4 font-bm text-lg text-grayscale-text">최근 활동</h2>
        <div className="overflow-hidden rounded-lg border border-grayscale-200">
          <table className="w-full">
            <thead className="bg-grayscale-50">
              <tr>
                <th className="px-4 py-3 text-left font-pretendard text-sm font-medium text-grayscale-700">사용자</th>
                <th className="px-4 py-3 text-left font-pretendard text-sm font-medium text-grayscale-700">활동</th>
                <th className="px-4 py-3 text-left font-pretendard text-sm font-medium text-grayscale-700">문서</th>
                <th className="px-4 py-3 text-right font-pretendard text-sm font-medium text-grayscale-700">시간</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grayscale-100">
              {recentActivities.map(activity => (
                <tr key={activity.id} className="hover:bg-grayscale-50">
                  <td className="px-4 py-3 font-pretendard text-sm text-grayscale-text">{activity.user}</td>
                  <td className="px-4 py-3 font-pretendard text-sm text-grayscale-text">{activity.action}</td>
                  <td className="px-4 py-3 font-pretendard text-sm text-primary-primary">{activity.document}</td>
                  <td className="px-4 py-3 text-right font-pretendard text-sm text-grayscale-400">{activity.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
