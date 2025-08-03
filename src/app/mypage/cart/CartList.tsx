'use client';

import { useActionState, useEffect, useState } from 'react';
import { getCartProducts } from '@/data/functions/post';
import { CartItemType, ApiResCart } from '@/types';
import useUserStore from '@/zustand/useStore';
import CartItemForm from '@/app/mypage/cart/CartItemForm';
import EmptyCart from '@/app/mypage/cart/EmptyCart';
import CustomLink from '@/components/common/CustomLink';
import { deleteCart, updateCartQuantity } from '@/data/actions/cart';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Loading from '@/app/mypage/cart/Loading';

export default function CartList() {
  const { user } = useUserStore();
  const accessToken = user?.token?.accessToken;
  const router = useRouter();

  const [res, setRes] = useState<ApiResCart<CartItemType[]> | null>(null);

  useEffect(() => {
    if (accessToken === null || accessToken === undefined) {
      // accessToken이 아직 로드 중이라면 아무것도 하지 않음
      return;
    }
    if (accessToken) {
      getCartProducts(accessToken).then(setRes);
    } else {
      Swal.fire({
        icon: 'warning',
        text: '로그인 후 이용해주세요',
        confirmButtonText: '확인',
      }).then(result => {
        if (result.isConfirmed) router.replace('/login');
      });
    }
  }, [accessToken]);

  const [deleteState, deleteAction] = useActionState(deleteCart, null);
  const [quantityState, quantityAction] = useActionState(
    updateCartQuantity,
    null,
  );

  useEffect(() => {
    if (quantityState?.ok || deleteState?.ok) {
      if (accessToken) {
        getCartProducts(accessToken).then(setRes);
      }
    }
  }, [quantityState, deleteState]);

  if (!res) {
    return <Loading />;
  }
  if (res.ok && res.item.length === 0) {
    return (
      <div className="h-full">
        <EmptyCart />
      </div>
    );
  }
  // if (res.ok === 0) {
  //   router.replace('/error'); // 실패 메시지 렌더링
  // }

  return (
    <div>
      {res.ok ? (
        res.item.map((item: CartItemType) => (
          <CartItemForm
            key={item._id}
            item={{
              _id: item._id,
              product_id: item.product._id,
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price,
              image: item.product.image,
              extra: item.product.extra,
            }}
            action={{
              deleteAction: deleteAction,
              quantityAction: quantityAction,
            }}
          />
        ))
      ) : (
        <p>{}</p>
      )}
      <p className="text-right lg:mt-[1.875rem] md:mt-6 mt-4 text-lg font-semibold">
        총 상품 금액{' '}
        {res.ok ? (
          <span className="text-[#8B0505]">
            {res?.cost?.total.toLocaleString()}
          </span>
        ) : (
          '0'
        )}
        원
      </p>
      <div className="flex justify-center lg:mt-[4.0625rem] md:mt-8 mt-6">
        <form>
          <CustomLink href="/order">주문하기</CustomLink>
        </form>
      </div>
    </div>
  );
}
