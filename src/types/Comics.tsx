export interface IMarvelComic {
    id: number;
    title: string;
    description: string;
    issueNumber: number;
    variants?: { resourceURI: string; name?: string }[];

    thumbnail: {
        path: string;
        extension: string;
    };
    dates: Array<{
        type: string;
        date: string;
    }>;
    prices: Array<{
        type: string;
        price: number;
    }>;
    series: {
        resourceURI: string;
        name: string;
    };
}

export interface IMarverSeries {
    resourceURI: string;
    name: string;
}


export interface IMarvelResponse {
    data: {
        offset: number;
        limit: number;
        total: number;
        count: number;
        results: IMarvelComic[];
    };
}
