import {expect, test} from '@jest/globals';
import {getVectorStoreHandler} from '../config';
import {AstraDBVectorStore, AstraLibArgs} from "@langchain/community/vectorstores/astradb";
import {FakeEmbeddings} from "@langchain/core/utils/testing";
import {Document} from "@langchain/core/documents";



describe("Astra tests", () => {
    beforeEach(async  () => {
        await getVectorStoreHandler().beforeTest()
    })
    afterEach(async () => {
        await getVectorStoreHandler().afterTest()
    })

    test('basic vector search', async () => {
        let config = getVectorStoreHandler().getBaseAstraLibArgs()
        let fakeEmbeddings = new FakeEmbeddings();
        config = {
            ...config,
            collectionOptions: {
                vector: {
                    dimension: 4,
                    metric: "cosine",
                },
            },
        }

        const vectorStore = await AstraDBVectorStore.fromTexts(
            [
                "AstraDB is a NoSQL DB",
                "AstraDB is built on Apache Cassandra",
                "AstraDB supports vector search",
            ],
            [{foo: "foo"}, {foo: "bar"}, {foo: "baz"}],
            fakeEmbeddings,
            config as AstraLibArgs
        );
        const results = await vectorStore.similaritySearch("Cassandra", 1);
        console.log(results)
        expect(results[0].pageContent).toBe("AstraDB is built on Apache Cassandra");

    });

    test('ingest errors', async () => {
        let config = getVectorStoreHandler().getBaseAstraLibArgs()
        let fakeEmbeddings = new FakeEmbeddings();
        config = {
            ...config,
            collectionOptions: {
                vector: {
                    dimension: 4,
                    metric: "cosine",
                },
            },
        }



        const vectorStore = new AstraDBVectorStore(fakeEmbeddings , config)
        await vectorStore.initialize()
        await vectorStore.addDocuments([{
            pageContent: "",
            metadata: {}}
        ])
    });
});
