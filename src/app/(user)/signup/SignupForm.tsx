'use client';

import { startTransition, useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createUser } from '@/data/actions/user';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import AddressForm from '@/components/common/Address';

export interface SignupFormProps {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  phone: string;
  postcode: string;
  addressDetail1: string;
  addressDetail2: string;
}

export default function SignupForm() {
  const [state, formAction, isLoading] = useActionState(createUser, null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormProps>({ mode: 'onChange' });

  useEffect(() => {
    if (state?.ok) {
      alert('회원 가입이 완료되었습니다');
      router.replace('/login');
    } else if (state?.ok === 0 && !state?.errors) {
      alert(state?.message);
    }
  }, [state, router]);

  const onSubmit = (data: SignupFormProps) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="lg:w-[28.625rem] space-y-[0.625rem]"
    >
      <input type="hidden" name="type" value="user" />

      {/* 이메일 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center w-[6rem]">
          <label htmlFor="email" className="block text-black lg:text-base">
            이메일
          </label>
          <span className="text-light-red lg:text-sm ml-1">*</span>
        </div>
        <div>
          <Input
            id="email"
            type="email"
            placeholder="이메일을 입력하세요"
            className="w-[20rem]"
            {...register('email', {
              required: '이메일을 입력해주세요',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '이메일 형식에 맞게 입력해주세요',
              },
            })}
          />
          {errors.email && (
            <p className="ml-2 mt-1 text-sm text-red-500 dark:text-red-400">
              {errors.email.message},
              {state?.ok === 0 && state.errors?.email?.msg}
            </p>
          )}
        </div>
      </div>

      {/* 비밀번호 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center w-[6rem]">
          <label htmlFor="password" className="block text-black lg:text-base">
            비밀번호
          </label>
          <span className="text-light-red lg:text-sm ml-1">*</span>
        </div>
        <div>
          <Input
            id="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            autoComplete="new-password"
            className="w-[20rem]"
            {...register('password', {
              required: '비밀번호를 입력해주세요',
              pattern: {
                value: /^(?=.*\d)(?=.*[!@#])[\dA-Za-z!@#]{6,}$/,
                message: '숫자와 특수문자를 포함한 6자리 이상이어야 합니다.',
              },
            })}
          />
          {errors.password && (
            <p className="ml-2 mt-1 text-sm text-red-500 dark:text-red-400 break-words w-[20rem]">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      {/* 비밀번호 확인 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center w-[7rem]">
          <label
            htmlFor="passwordConfirm"
            className="block text-black lg:text-base"
          >
            비밀번호 확인
          </label>
          <span className="text-light-red lg:text-sm ml-1">*</span>
        </div>
        <div>
          <Input
            id="passwordConfirm"
            type="password"
            placeholder="비밀번호를 한번 더 입력하세요"
            className="w-[20rem]"
            {...register('passwordConfirm', {
              required: '비밀번호를 확인해주세요',
              validate: (value, formValues) =>
                value === formValues.password || '비밀번호가 일치하지 않습니다',
            })}
          />
          {errors.passwordConfirm && (
            <p className="ml-2 mt-1 text-sm text-red-500 dark:text-red-400">
              {errors.passwordConfirm.message}
            </p>
          )}
        </div>
      </div>

      {/* 이름 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center w-[6rem]">
          <label htmlFor="name" className="block text-black lg:text-base">
            이름
          </label>
          <span className="text-light-red lg:text-sm ml-1">*</span>
        </div>
        <div>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="이름을 입력하세요"
            {...register('name', {
              required: '이름를 입력해주세요',
            })}
          />
          {errors.name && (
            <p className="ml-2 mt-1 text-sm text-red-500 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>
      </div>

      {/* 전화번호 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center w-[6rem]">
          <label htmlFor="phone" className="block text-black lg:text-base">
            전화번호
          </label>
          <span className="text-light-red lg:text-sm ml-1">*</span>
        </div>
        <div>
          <Input
            id="phone"
            type="text"
            autoComplete="tel"
            placeholder="전화번호를 입력하세요"
            className="w-[20rem]"
            {...register('phone', {
              required: '전화번호를 입력해주세요',
              pattern: {
                value: /^[0-9-]+$/,
                message: '숫자와 하이픈(-)만 입력 가능합니다',
              },
            })}
          />
          {errors.phone && (
            <p className="ml-2 mt-1 text-sm text-red-500 dark:text-red-400">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      <AddressForm
        register={register}
        setValue={setValue}
        errors={errors}
        required
      />

      <div className="flex justify-center items-center lg:mt-[2rem] lg:mb-[6.25rem]">
        <Button size="xxl" type="submit" disabled={isLoading}>
          가입하기
        </Button>
      </div>
    </form>
  );
}
