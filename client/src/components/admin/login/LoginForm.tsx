'use client';

import {route} from '@constants/route';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

export default function LoginForm() {
  const [adminForm, setAdminForm] = useState({
    loginId: '',
    password: '',
  });

  const [isValid, setIsValid] = useState({
    loginId: false,
    password: false,
  });

  const router = useRouter();

  const loginIdRegex = /^(?=.*[a-zA-Z가-힣]).{4,20}$/;
  const passwordRegex = /^(?=.*[a-zA-Z가-힣])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setAdminForm(prev => ({...prev, [name]: value}));

    if (name === 'loginId') {
      setIsValid(prev => ({...prev, loginId: loginIdRegex.test(value)}));
    } else if (name === 'password') {
      setIsValid(prev => ({...prev, password: passwordRegex.test(value)}));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginIdRegex.test(adminForm.loginId)) {
      alert('아이디는 4~20자이며, 문자(영문자 또는 한글)를 반드시 포함해야 합니다.');
      return;
    }
    if (!passwordRegex.test(adminForm.password)) {
      alert('비밀번호는 8자 이상이며, 문자(영문자 또는 한글), 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.');
      return;
    }

    try {
      const response = await fetch('/api/post-admin-login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(adminForm),
      });

      if (!response.ok) {
        if (response.status === 400 || response.status === 401 || response.status === 404) {
          alert('아이디 또는 비밀번호가 올바르지 않습니다.');
        } else if (response.status >= 500) {
          alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
        return;
      }

      router.replace(route.goAdminDocument());
    } catch (error) {
      if (error instanceof Error) {
        console.error('로그인 중 네트워크 오류 발생:', error.message);
        alert('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
      }
    }
  };

  return (
    <div className="w-[80%] max-w-lg rounded-xl bg-white px-8 py-10 shadow-lg md:w-full">
      <h2 className="mb-8 text-center font-bm text-3xl text-grayscale-text">관리자 로그인</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="loginId" className="mb-2 block font-pretendard text-sm font-medium text-grayscale-700">
            아이디
          </label>
          <input
            type="text"
            id="loginId"
            name="loginId"
            value={adminForm.loginId}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-grayscale-200 px-4 py-3 font-pretendard text-grayscale-800 transition-colors placeholder:text-grayscale-lightText focus:border-primary-primary focus:outline-none focus:ring-2 focus:ring-primary-primary/20"
            placeholder="아이디를 입력하세요"
            autoComplete="off"
          />
        </div>
        <div className="mb-8">
          <label htmlFor="password" className="mb-2 block font-pretendard text-sm font-medium text-grayscale-700">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={adminForm.password}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-grayscale-200 px-4 py-3 font-pretendard text-grayscale-800 transition-colors placeholder:text-grayscale-lightText focus:border-primary-primary focus:outline-none focus:ring-2 focus:ring-primary-primary/20"
            placeholder="비밀번호를 입력하세요"
            autoComplete="new-password"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-primary-primary px-4 py-3 font-bm text-white transition-all duration-200 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-primary/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-grayscale-300 disabled:text-grayscale-500 disabled:active:scale-100"
          disabled={!isValid.loginId || !isValid.password}
        >
          로그인
        </button>
      </form>
    </div>
  );
}
