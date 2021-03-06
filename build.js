const {TwingEnvironment, TwingLoaderArray} = require('twing');
const YAML = require('yaml')
const {readFileSync, writeFileSync} = require('fs');

console.log('Building...');

const fsIndex = readFileSync('index.twig', 'utf8');
const fsContent = readFileSync('content.yaml', 'utf8');
const ymlContent = YAML.parse(fsContent);
console.log("Content:\n", fsContent);

const loader = new TwingLoaderArray({
    'index.twig': fsIndex
});

const twing = new TwingEnvironment(loader);

twing.render('index.twig', ymlContent).then((page) => {
    writeFileSync('index.html', page);
    console.log('Complete.');
});