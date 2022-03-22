function $(sel) { return document.querySelector(sel); }

const term = new Terminal({
    convertEol: true,
    cursorBlink: true,
    cursorStyle: 'block',
});
const fitter = new FitAddon();
const readline = new LocalEchoController({ historySize: Infinity });
term.open($('#terminal'));
term.loadAddon(fitter);
term.loadAddon(readline);
fitter.fit();
term.write('Phoo is loading... ');

var loading = (function load() {
    var x = '/-\\|';
    var i = 0;
    return (function test() {
        term.write('\b');
        term.write(x[i]);
        if (++i == x.length) i = 0;
        return setTimeout(test, 250);
    })();
})();

// do load
import('../src/index.js').then(async imodule => {
    clearTimeout(loading);
    term.clear();
    term.writeln('Hello world');
    term.focus();

    const PROMPT_1 = '\x1b[31m->\x1b[0m ';
    const PROMPT_2 = '\x1b[31m..\x1b[0m ';

    while (true) {
        runCommand(await readline.read(PROMPT_1, PROMPT_2));
    }
    function runCommand(c) {
        term.writeln(`\x1b[31m${c}\x1b[0m`);
    }

    function kill() {
        term.writeln('\x1b[31mKilled\x1b[0m');
    }

}).catch(e => {
    term.clear();
    term.write('\x1b[41m');
    term.write('Fatal error!\n\n');
    term.write(e.stack);
});
