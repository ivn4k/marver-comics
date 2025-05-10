import { makeAutoObservable, runInAction } from 'mobx';
import api from '../api/axiosConfig';
import axios from 'axios';
import { IMarvelComic, IMarvelResponse } from '../types/Comics';
import { toast } from 'react-toastify';
import { generateMarvelHash, generateTimestamp } from '../utils/apiUtils';

class ComicsStore {
    comics: IMarvelComic[] = [];
    currentComic: IMarvelComic | null = null;
    seriesComics: IMarvelComic[] = [];
    variants: IMarvelComic[] = [];
    relatedComics: IMarvelComic[] = [];
    loading: boolean = false;
    error: string | null = null;
    totalComics: number = 0;
    offset: number = 0;
    limit: number = 20;
    showError: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    private async getAuthParams() {
        const timestamp = generateTimestamp();
        const hash = await generateMarvelHash(
            timestamp,
            import.meta.env.VITE_MARVEL_API_PUBLIC_KEY,
            import.meta.env.VITE_MARVEL_API_PRIVATE_KEY
        );

        return {
            apikey: import.meta.env.VITE_MARVEL_API_PUBLIC_KEY,
            ts: timestamp,
            hash: hash
        };
    }

    async fetchComics(offset: number = 0, limit: number = 20) {
        this.loading = true;
        this.error = null;

        try {
            const params = await this.getAuthParams();
            const response = await api.get<IMarvelResponse>('/comics', {
                params: {
                    ...params,
                    offset,
                    limit,
                    orderBy: '-focDate'
                }
            });

            runInAction(() => {
                this.comics = response.data.data.results;
                this.totalComics = response.data.data.total;
                this.offset = response.data.data.offset;
                this.limit = response.data.data.limit;
                this.loading = false;
            });

            if (response.data.data.results.length === 0) {
                toast.info('No comics found');
            }
        } catch (error) {
            this.handleError(error);
        }
    }

    async fetchComicById(id: number) {
        this.loading = true;
        this.error = null;
        this.variants = [];
        this.seriesComics = [];

        try {
            const params = await this.getAuthParams();
            const response = await api.get<IMarvelResponse>(`/comics/${id}`, {
                params
            });

            if (!response.data.data.results.length) {
                toast.error('Comic not found');
                return;
            }

            runInAction(() => {
                this.currentComic = response.data.data.results[0];
            });

            // Получаем варианты комикса
            if (this.currentComic?.variants && this.currentComic.variants.length > 0) {
                const variantIds = this.currentComic.variants.map(v => 
                    v.resourceURI.split('/').pop()
                ).filter((id): id is string => id !== undefined);
                await this.fetchVariants(variantIds);
            }

            // Получаем комиксы серии
            if (this.currentComic?.series?.resourceURI) {
                await this.fetchSeriesComics(this.currentComic.series.resourceURI);
            }

            runInAction(() => {
                this.loading = false;
            });
        } catch (error) {
            this.handleError(error);
        }
    }

    private async fetchVariants(variantIds: string[]) {
        try {
            const params = await this.getAuthParams();
            const variantRequests = variantIds.map(id => 
                api.get<IMarvelResponse>(`/comics/${id}`, {
                    params
                })
            );

            const responses = await Promise.all(variantRequests);
            
            runInAction(() => {
                this.variants = responses.map(res => res.data.data.results[0]);
            });
        } catch (error) {
            this.handleError(error);
        }
    }

    async fetchSeriesComics(seriesUri: string) {
        try {
            const seriesId = seriesUri.split('/').pop();
            const params = await this.getAuthParams();
            const response = await api.get<IMarvelResponse>(`/series/${seriesId}/comics`, {
                params: {
                    ...params,
                    orderBy: 'issueNumber'
                }
            });

            runInAction(() => {
                // Фильтруем, исключая текущий комикс и его варианты
                this.seriesComics = response.data.data.results.filter(comic => 
                    comic.id !== this.currentComic?.id &&
                    !this.variants.some(v => v.id === comic.id)
                );
            });
        } catch (error) {
            this.handleError(error);
        }
    }

    async fetchRelatedComics(issueNumber: number) {
        try {
            const params = await this.getAuthParams();
            const response = await api.get<IMarvelResponse>('/comics', {
                params: {
                    ...params,
                    issueNumber,
                    limit: 4
                }
            });

            runInAction(() => {
                this.relatedComics = response.data.data.results;
            });
        } catch (error) {
            this.handleError(error);
        }
    }

    getNextInSeries(): number | null {
        if (!this.seriesComics.length) return null;
        
        const currentIssueNumber = this.currentComic?.issueNumber || 0;
        const nextComic = this.seriesComics.find(comic => 
            comic.issueNumber > currentIssueNumber
        );
        
        return nextComic?.id || null;
    }

    getPreviousInSeries(): number | null {
        if (!this.seriesComics.length) return null;
        
        const currentIssueNumber = this.currentComic?.issueNumber || 0;
        const previousComic = [...this.seriesComics]
            .reverse()
            .find(comic => comic.issueNumber < currentIssueNumber);
        
        return previousComic?.id || null;
    }

    private handleError(error: unknown) {
        console.group('Error Details');
        console.log('Error object:', error);
        console.log('Stack trace:', new Error().stack);

        runInAction(() => {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const message = error.response?.data?.message || error.message;
                
                console.log('Axios Error Status:', status);
                console.log('Axios Error Message:', message);
                console.log('Axios Error Response:', error.response?.data);
                
                switch (status) {
                    case 401:
                        toast.error('Authentication failed. Please check API keys.');
                        this.error = 'Authentication failed';
                        break;
                    case 403:
                        toast.error('Access forbidden. Please check API permissions.');
                        this.error = 'Access forbidden';
                        break;
                    case 404:
                        toast.error('Comic not found');
                        this.error = 'Comic not found';
                        break;
                    case 429:
                        toast.error('Too many requests. Please try again later.');
                        this.error = 'Rate limit exceeded';
                        break;
                    case undefined:
                        toast.error('Network error. Please check your connection.');
                        this.error = 'Network error';
                        break;
                    default:
                        toast.error(`Error: ${message}`);
                        this.error = message;
                }
            } else {
                const errorMessage = error instanceof Error 
                    ? error.message 
                    : 'An unexpected error occurred';
                
                console.log('Non-Axios Error:', error);
                console.log('Error Message:', errorMessage);
                
                toast.error(errorMessage);
                this.error = errorMessage;
            }
            this.loading = false;
            this.showError = true;
        });
        
        console.groupEnd();
    }

    clearError() {
        this.error = null;
        this.showError = false;
    }
}

export const comicsStore = new ComicsStore();