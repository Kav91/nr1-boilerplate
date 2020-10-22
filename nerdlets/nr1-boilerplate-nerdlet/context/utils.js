/* eslint no-use-before-define: 0 */ // --> OFF
import { UserStorageQuery, UserStorageMutation } from 'nr1';

// https://developer.newrelic.com/components/user-storage-query
export const getUserCollection = async (collection, documentId) => {
  const payload = { collection };
  if (documentId) payload.documentId = documentId;
  const result = await UserStorageQuery.query(payload);
  const collectionResult = (result || {}).data || (documentId ? null : []);
  return collectionResult;
};

// https://developer.newrelic.com/components/user-storage-mutation
export const writeUserDocument = async (collection, documentId, payload) => {
  const result = await UserStorageMutation.mutate({
    actionType: UserStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
    collection,
    documentId,
    document: payload
  });
  return result;
};
