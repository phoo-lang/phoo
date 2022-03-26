
var count = 0;
var run;
const esc = $.terminal.escape_brackets;

const term = $('body').terminal(c => run(c), {
    enabled: false,
    exit: false,
    greetings: 'Phoo is loading...',
    prompt: () => `[[;blue;]${esc(`[${count}]`)}-->] `,
    keymap: {
        ENTER(e, original) {
            var i = next_indent_level(this.get_command());
            if (i === 0) {
                original();
            } else {
                this.insert('\n' + ' '.repeat(4 * i));
            }
        }
    }
});

run = () => term.error('Still loading... be patient...');

var loading = true;
(function () {
    var chars = '-\\|/';
    var i = 0;
    (function tick() {
        if (loading) {
            setTimeout(tick, 100);
            term.update(0, `Phoo is loading... ${chars[i]}`);
            if (++i == chars.length) i = 0;
        }
    })();
})();

// do load
import('../src/index.js').then(async imodule => {
    await new Promise(r => setTimeout(r, 750));
    loading = false;
    term.update(0, 'Welcome to Phoo.');
    term.enable();
    term.focus();

    run = async function runCommand(c) {
        term.echo('[[g;;]Sleeping]');
        await new Promise(r => setTimeout(r, 1000));
        if (c) {
            term.update(-1, `\n[[;red;]You said:]\n[[;green;]${esc(c)}]`);
            count++;
        }
    };

}).catch(e => {
    loading = false;
    term.error('\nFatal error!');
    term.exception(e);
    term.freeze();
    throw e;
});

function next_indent_level(text) {
    var count = 0;
    const levels = { do: 1, end: -1, '[': 1, ']': -1 };
    for (var word of text.split(/\s+/)) count += levels[word] || 0;
    return count;
}