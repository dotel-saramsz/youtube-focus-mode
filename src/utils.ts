import { VideoNode } from "./core/VideoStore";

/**
 * Gets the video id and video link node from the thumbnail container
 * through BFS traversal
 * @param node An HTML DOM node that represent the thumbnail container
 */
export const getVideoNode: (node: Node) => VideoNode | null = (node: Node) => {
    const nodesToVisit: Node[] = [];
    const visitedNodes: Node[] = [];

    nodesToVisit.push(node);

    while (nodesToVisit.length > 0) {
        // Remove the first element from the queue
        const currentNode = nodesToVisit.shift();

        if (currentNode && !visitedNodes.includes(currentNode)) {
            // Mark the node as visited
            visitedNodes.push(currentNode);

            if (currentNode?.hasChildNodes()) {
                // Check presence of element with video id <a id='thumbnail' >
                const childNodes = currentNode.childNodes;

                for (let i = 0; i < childNodes.length; i++) {
                    const childNode = childNodes[i];
                    if (
                        childNode.nodeName == "A" && // @ts-ignore
                        childNode?.id == "thumbnail"
                    ) {
                        const videoId = getVideoId(childNode);
                        if (videoId) {
                            return { videoId: videoId, linkNode: childNode };
                        }
                    } else {
                        // ChildNode is not the element. Traverse it further
                        nodesToVisit.push(childNode);
                    }
                }
            }
        }
    }
    return null;
};

export const getVideoId = (node: Node): string | null => {
    // @ts-ignore
    const url = node.getAttribute("href");
    const idParser = /\/watch\?v=([^\s&]+)/g;
    const match = idParser.exec(url);
    if (match) {
        return match[1];
    } else {
        return null;
    }
};
