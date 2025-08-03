'use client';

import { startTransition, useActionState, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateUser } from '@/data/actions/user';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import useUserStore from '@/zustand/useStore';
import AddressForm from '@/components/common/Address';
import { SignupFormProps } from '@/app/(user)/signup/SignupForm';
import Swal from 'sweetalert2';
import { ApiRes, MemberType } from '@/types';
import { getMember } from '@/data/functions/post';

export default function SocialEditForm() {
  const { user } = useUserStore();
  const [state, formAction, isLoading] = useActionState(updateUser, null);
  const router = useRouter();
  const [res, setRes] = useState<ApiRes<MemberType> | null>(null);

  useEffect(() => {
    const user_id = Number(user?._id);
    getMember(user_id).then(setRes);
  }, [user]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormProps>({ mode: 'onChange' });

  useEffect(() => {
    if (res?.ok && res.item) {
      setValue('phone', res.item.phone ?? '');
      setValue('postcode', res.item.postcode ?? '');
      setValue('addressDetail1', res.item.addressDetail1 ?? '');
      setValue('addressDetail2', res.item.addressDetail2 ?? '');
    }
  }, [res]);

  const onSubmit = (data: SignupFormProps) => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        text: '로그인 후 이용해주세요',
        confirmButtonText: '확인',
      }).then(result => {
        if (result.isConfirmed) router.replace('/login');
      });
      return;
    }

    //수정한 값만 보내고 수정하지 않은 값은 보내지 않도록
    const formData = new FormData();

    formData.append('phone', data.phone || user.phone || '');
    formData.append('postcode', data.postcode || user.postcode || '');
    formData.append(
      'addressDetail1',
      data.addressDetail1 || user.addressDetail1 || '',
    );
    formData.append(
      'addressDetail2',
      data.addressDetail2 || user.addressDetail2 || '',
    );
    formData.append('password', data.password || '');

    formData.append('userId', user._id.toString());
    formData.append('accessToken', user.token?.accessToken ?? '');

    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state?.ok) {
      const updatedUser = Array.isArray(state.item)
        ? state.item[0]
        : state.item;

      useUserStore.setState(prev => ({
        user: {
          ...prev.user,
          ...updatedUser,
        },
      }));
      Swal.fire({
        icon: 'success',
        title: '회원정보 수정 완료',
        text: '저장이 완료되었습니다.',
        confirmButtonText: '확인',
      }).then(result => {
        if (result.isConfirmed) {
          router.replace('/mypage/user');
        }
      });
    } else if (state?.ok === 0 && !state?.errors) {
      alert(state?.message);
    }
  }, [state, router]);

  if (!res) {
    return <div>로딩중</div>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="w-[320px] md:w-[428px] lg:w-[28.625rem] space-y-[0.625rem]"
    >
      {/* 이름 */}
      <div className="flex items-center flex-col md:justify-between md:flex-row lg:justify-between">
        <div className="flex items-start w-full">
          <label htmlFor="name" className="block text-black lg:text-base">
            이름
          </label>
        </div>
        <div>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="이름을 입력하세요"
            className="w-[320px] text-xs lg:text-sm px-[0.75rem]"
            defaultValue={user?.name ?? ''}
            disabled
            readOnly
          />
        </div>
      </div>

      {/* 전화번호 */}
      <div className="flex items-center flex-col md:justify-between md:flex-row lg:justify-between">
        <div className="flex items-start w-full">
          <label
            htmlFor="phone"
            className="block text-black text-sm md:text-base lg:text-base"
          >
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
            className="w-[320px] text-xs lg:text-sm px-[0.75rem]"
            defaultValue={res.ok ? res.item.phone : ''}
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

      <div className="flex justify-center items-center mb-[60px] mt-[50px] md:mb-[80px] lg:mt-[2rem] lg:mb-[6.25rem]">
        <Button size="xxl" type="submit" disabled={isLoading}>
          저장하기
        </Button>
      </div>
    </form>
  );
}
