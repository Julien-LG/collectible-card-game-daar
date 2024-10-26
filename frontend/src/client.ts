
import * as axios from 'axios';
import { Parameter } from './interfaces/parameter';

export class Client {
    private  POKEMONTCG_API_BASE_URL: string;
    private  POKEMONTCG_API_VERSION: string;
    private  POKEMONTCG_API_URL: string;
    private  POKEMONTCG_API_KEY?: string;

    private static instance: Client;

    private constructor() {
        this.POKEMONTCG_API_BASE_URL = 'https://api.pokemontcg.io';
        this.POKEMONTCG_API_VERSION = '2';
        this.POKEMONTCG_API_URL = `${this.POKEMONTCG_API_BASE_URL}/v${this.POKEMONTCG_API_VERSION}`;
        this.POKEMONTCG_API_KEY = import.meta.env.POKEMONTCG_API_KEY;
    }

    public static getInstance(): Client {
        if (!Client.instance) {
            Client.instance = new Client();
        }

        return Client.instance;
    }

    async get<T extends object>(resource: string, params?: Parameter | string): Promise<T> {
        let url = `${this.POKEMONTCG_API_URL}/${resource}`;
        const headers : Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.POKEMONTCG_API_KEY) {
            headers['X-Api-Key'] = this.POKEMONTCG_API_KEY;
        }

        const config: axios.AxiosRequestConfig = {
            headers,
        };

        if (typeof params === 'string') {
            url += `/${params}`;
        } else if (params) {
            url += `?${this.stringify(params)}`;
        }

        return axios.default
            .get<T>(url, config)
            .then((response) => {
                const data = response.data as Record<string, T>;
                return data[Object.keys(data)[0]];
            })
            .catch((error) => Promise.reject(error));
    }

    // Fonction stringify avec assertion de type explicite pour chaque valeur de params[key]
    private stringify(params: Parameter): string {
        const queryString = Object.keys(params)
            .map((key: string) => {
                const value = params[key as keyof Parameter] as string | number | undefined;
                return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
            })
            .join('&');

        return queryString;
    }

}
