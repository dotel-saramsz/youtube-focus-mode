export const getVideoIdByTraversal: (node: Node) => string | null = (
    node: Node
) => {
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
                        // @ts-ignore
                        const videoUrl: string = childNode.getAttribute("href");
                        const idParser = /\/watch\?v=([^\s&]+)/g;
                        const match = idParser.exec(videoUrl);
                        if (match) {
                            return match[1];
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
