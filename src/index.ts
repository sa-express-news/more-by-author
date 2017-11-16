import * as constants from './constants';

import authorFeedMap from './authorFeedMap';

import { AuthorFeedItem } from './interfaces';

const findByline = (document: Document): string => {
    return document.querySelector(constants.BYLINE_SELECTOR).textContent;
}

const main = async (): Promise<void> => {
    // Find the byline in the current article

    console.log('checking for author');

    const author = findByline(document);

    console.log(author);

    if (!author) return;

    // If byline exists, check if it matches any of the entries in the array of author:feed map

    const matchingAuthorFeedMap = authorFeedMap.find((map) => map.name === author);

    if (!matchingAuthorFeedMap) return;

    // If a match is found, make a GET request to the given feed

    const { feedURL } = matchingAuthorFeedMap;

    const rawFeedResponse = await fetch(feedURL);

    const feedResponse: AuthorFeedItem | AuthorFeedItem[] = await rawFeedResponse.json();

    console.log(feedResponse);

    // Extract the headline and story link from the feed

}

main();


