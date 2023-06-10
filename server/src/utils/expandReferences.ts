import admin from 'firebase-admin';

type DocumentReference<T> = admin.firestore.DocumentReference<T>;
type Expand<T> = T extends DocumentReference<infer U> ? U : T;

async function expandReferences<T>(data: T): Promise<Expand<T>> {
    if (typeof data !== 'object' || data === null) {
        return data as Expand<T>;
    }

    const expandedData = {} as Expand<T>;

    await Promise.all(
        Object.entries(data).map(async ([key, value]) => {
            if (value instanceof admin.firestore.DocumentReference) {
                const referencedDoc = await value.get();
                expandedData[key as keyof Expand<T>] =
                    await expandReferences(referencedDoc.data());
            } else {
                expandedData[key as keyof Expand<T>] =
                    await expandReferences(value);
            }
        })
    );

    return expandedData;
}
