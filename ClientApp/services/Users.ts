import RestUtilities from './RestUtilities';

export default class users {

    uploadFiles(files) {
        return RestUtilities.upload('/api/users/uploadFiles', files);
    }
}