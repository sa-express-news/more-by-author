import * as constants from './constants';

import authorFeedMap from './authorFeedMap';

import { AuthorFeedItem } from './interfaces';

const findByline = (document: Document): string => {
    return document.querySelector(constants.BYLINE_SELECTOR).textContent;
}

// Given an array of feed items, return a <div.more-by-author> containing each item
// Formatted as a <p> containing an <a> 

const createAuthorBox = (feedItems: AuthorFeedItem[]): HTMLDivElement => {

    // Given a feed item, return <p><a href={feed item's URL}>{feed item's headline}</a></p>

    const createStoryLink = (storyData: AuthorFeedItem): HTMLParagraphElement => {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.innerText = storyData.titleText;
        a.href = storyData.redirectionUrl;
        p.appendChild(a);

        return p;
    }

    const div = document.createElement('div');
    div.classList.add('more-by-author');

    const paragraphs = feedItems.map((feedItem) => createStoryLink(feedItem));

    paragraphs.forEach((paragraph) => div.appendChild(paragraph));

    return div;

}

const main = async (): Promise<void> => {
    // Find the byline in the current article

    const author = findByline(document);

    if (!author) return;

    // If byline exists, check if it matches any of the entries in the array of author:feed map

    const matchingAuthorFeedMap = authorFeedMap.find((map) => map.name === author);

    if (!matchingAuthorFeedMap) return;

    // If a match is found, make a GET request to the given feed

    const { feedURL } = matchingAuthorFeedMap;

    const rawFeedResponse = await fetch(feedURL);

    let feedResponse: AuthorFeedItem | AuthorFeedItem[] = await rawFeedResponse.json();

    if (!Array.isArray(feedResponse)) {
        feedResponse = [feedResponse];
    }

    const authorBox = createAuthorBox(feedResponse);

    const elementToInsertAfter = document.querySelector(constants.SIBLING_INSERT_SELECTOR);

    elementToInsertAfter.parentNode.insertBefore(authorBox, elementToInsertAfter.nextSibling);

}

main();


