

function name(e) {
    const BASE_URL = `https://pixabay.com/api/?key=33644503-8362a9998fd91a1346b48519b&q=${e}`;
    fetch(BASE_URL).then(res => res.json)
}

