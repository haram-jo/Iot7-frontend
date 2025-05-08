import {API_URL} from '@env';

interface ReviewPayload {
  menuId: number;
  userId: string;
  reviewContent: string;
  reviewRating: number;
  taste: string;
  amount: string;
  wouldVisitAgain: string;
  imageUrls: string[];
  receiptVerified: number;
  pairedMenuId?: number;
  combinationContent?: string;
}

export const submitReview = async (payload: ReviewPayload) => {
  console.log('📦 서버로 보내는 리뷰 payload:', payload); // ✅ 추가
  const response = await fetch(`${API_URL}/api/reviews`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('리뷰 등록 실패');
  }

  return response.json();
};
