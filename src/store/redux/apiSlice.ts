import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface SurahMeta {
  id: number;
  name_arabic: string;
  name_simple: string;
  name_complex: string;
  translated_name: { name: string };
  verses_count: number;
  revelation_place: string;
  page_start: number;
  page_end: number;
  bismillah_pre: boolean;
}

export interface Verse {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  translation: string;
}

export const quranApi = createApi({
  reducerPath: 'quranApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://interview-task-backend-nu.vercel.app/api',
    timeout: 15000, // 15 seconds timeout
  }),
  tagTypes: ['Surah', 'Ayah'],
  endpoints: (builder) => ({
    getSurahs: builder.query<SurahMeta[], void>({
      query: () => 'surahs',
      transformResponse: (response: any[]) => response.map(s => ({
        id: s.id,
        name_arabic: s.nameArabic,
        name_simple: s.nameSimple,
        name_complex: s.nameComplex,
        translated_name: { name: s.nameTranslation },
        verses_count: s.versesCount,
        revelation_place: s.revelationPlace,
        page_start: s.pageStart,
        page_end: s.pageEnd,
        bismillah_pre: s.bismillahPre
      })),
      providesTags: ['Surah'],
    }),
    getSurahById: builder.query<SurahMeta, number>({
      query: (id) => `surahs/${id}`,
      transformResponse: (s: any) => ({
        id: s.id,
        name_arabic: s.nameArabic,
        name_simple: s.nameSimple,
        name_complex: s.nameComplex,
        translated_name: { name: s.nameTranslation },
        verses_count: s.versesCount,
        revelation_place: s.revelationPlace,
        page_start: s.pageStart,
        page_end: s.pageEnd,
        bismillah_pre: s.bismillahPre
      }),
      providesTags: (result, error, id) => [{ type: 'Surah', id }],
    }),
    getAyahsBySurah: builder.query<Verse[], number>({
      query: (id) => `surahs/${id}/ayahs`,
      transformResponse: (response: any[]) => response.map(a => ({
        id: a.id,
        verse_number: a.verseNumber,
        verse_key: a.verseKey,
        text_uthmani: a.textUthmani,
        translation: a.translation
      })),
      providesTags: (result, error, id) => [{ type: 'Ayah', id }],
    }),
    searchVerses: builder.query<any[], string>({
      query: (q) => `search?q=${encodeURIComponent(q)}`,
      transformResponse: (response: any[]) => response.map(a => ({
        verse_key: a.verseKey,
        text: a.textUthmani,
        translations: [{ text: a.translation, name: 'Local' }]
      })),
    }),
  }),
});

export const { 
  useGetSurahsQuery, 
  useGetSurahByIdQuery, 
  useGetAyahsBySurahQuery,
  useSearchVersesQuery
} = quranApi;
