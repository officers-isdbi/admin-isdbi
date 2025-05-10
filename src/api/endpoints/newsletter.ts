/* import { transformToStringsRecord } from '@client/tools/transform';

import axiosConfig from '..';

export async function getNewsLetter(query: QuerySearchI<NewsLetterSortableFields>) {
	const stringifiedQuery = new URLSearchParams(
		transformToStringsRecord(query as unknown as Record<string, string | number | undefined>)
	).toString();
	return (await axiosConfig.get<ResponseI<ListOf<PublicNewsLetterI>>>(`/newsletter?${stringifiedQuery}`)).data;
}

export async function sendPromotionsEmail(mail: PromotionMailI) {
	return (await axiosConfig.post<ResponseI<null>>(`/newsletter`, mail)).data;
}
 */
