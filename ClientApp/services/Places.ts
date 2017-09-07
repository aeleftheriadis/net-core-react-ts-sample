import RestUtilities from './RestUtilities';

export enum PlaceType { Bridgestone, Avis }

export interface IPlace {
    id?: string,
    title: string;
    description: string;
    lat: number;
    long: number;
    address: string;
    city: string;
    postCode: string;
    placeType: PlaceType;

}

export default class places {
    fetchAll() {
        return RestUtilities.get<Array<IPlace>>('/api/places');
    }

    fetch(id: string) {
        return RestUtilities.get<IPlace>(`/api/places/${id}`);
    }

    search(query: string) {
        return RestUtilities.get<Array<IPlace>>(`/api/places/search/?q=${query}`);
    }

    update(page: IPlace) {
        return RestUtilities.put<IPlace>(`/api/places/${page.id}`, page);
    }

    create(page: IPlace) {
        return RestUtilities.post<IPlace>('/api/places', page);
    }

    save(page: IPlace) {
        if (page.id) {
            return this.update(page);
        } else {
            return this.create(page);
        }
    }

    delete(id: string) {
        return RestUtilities.delete(`/api/places/${id}`);
    }
}

