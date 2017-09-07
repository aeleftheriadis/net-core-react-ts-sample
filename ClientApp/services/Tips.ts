import RestUtilities from './RestUtilities';

export interface ITip {
    id?: string,
    title: string;
}

export default class Tips {
    fetchAll() {
        return RestUtilities.get<Array<ITip>>('/api/tips');
    }

    fetch(id: string) {
        return RestUtilities.get<ITip>(`/api/tips/${id}`);
    }

    search(query: string) {
        return RestUtilities.get<Array<ITip>>(`/api/tips/search/?q=${query}`);
    }

    update(tip: ITip) {
        return RestUtilities.put<ITip>(`/api/tips/${tip.id}`, tip);
    }

    create(tip: ITip) {
        return RestUtilities.post<ITip>('/api/tips', tip);
    }

    save(tip: ITip) {
        if (tip.id) {
            return this.update(tip);
        } else {
            return this.create(tip);
        }
    }

    delete(id: string) {
        return RestUtilities.delete(`/api/tips/${id}`);
    }
}

