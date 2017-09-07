import RestUtilities from './RestUtilities';

export interface IPage {
    id?: string,
    title: string;
    description: string;
}

export default class Pages {
    fetchAll() {
        return RestUtilities.get<Array<IPage>>('/api/pages');
    }

    fetch(id: string) {
        return RestUtilities.get<IPage>(`/api/pages/${id}`);
    }

    search(query: string) {
        return RestUtilities.get<Array<IPage>>(`/api/pages/search/?q=${query}`);
    }

    update(page: IPage) {
        return RestUtilities.put<IPage>(`/api/pages/${page.id}`, page);
    }

    create(page: IPage) {
        return RestUtilities.post<IPage>('/api/pages', page);
    }

    save(page: IPage) {
        if (page.id) {
            return this.update(page);
        } else {
            return this.create(page);
        }
    }

    delete(id: string) {
        return RestUtilities.delete(`/api/pages/${id}`);
    }
}

