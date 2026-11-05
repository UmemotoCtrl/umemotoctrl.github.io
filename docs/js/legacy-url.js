"use strict";

const routes = ["","others/MathjaxUsage/","others/latexMath/","others/markdown/","others/mathNotation/","others/usageForParsers/","piinfo/","recruitment/","research/aperiodic/","research/bridge/","research/dob/","research/drone/","researchworks/","sample/","tips/"];
const match = location.search.match(/^\?id=\/?([\w/-]+)$/);
if (match) {
    const route = match[1] === "index" ? "" : `${match[1]}/`;
    if (routes.includes(route)) {
        const destination = new URL(location.pathname.replace(/\/+$/, "") + "/" + route, location.origin);
        destination.hash = location.hash;
        location.replace(destination.href);
    }
}
