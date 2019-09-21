"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const tc = __importStar(require("@actions/tool-cache"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const IS_WINDOWS = process.platform === 'win32';
function findRubyVersion(engineAndVersion) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!engineAndVersion.includes('-')) {
            engineAndVersion = 'Ruby-' + engineAndVersion;
        }
        const [engine, version] = engineAndVersion.split('-', 2);
        let installDir = tc.find(engine, version);
        if (!installDir && engine == 'truffleruby') {
            installDir = yield downloadTruffleRuby(version);
        }
        if (!installDir) {
            throw new Error(`Ruby version ${engine}-${version} not found`);
        }
        const toolPath = path.join(installDir, 'bin');
        if (!IS_WINDOWS) {
            // Ruby / Gem heavily use the '#!/usr/bin/ruby' to find ruby, so this task needs to
            // replace that version of ruby so all the correct version of ruby gets selected
            // replace the default
            const dest = '/usr/bin/ruby';
            exec.exec('sudo ln', ['-sf', path.join(toolPath, 'ruby'), dest]); // replace any existing
        }
        core.addPath(toolPath);
    });
}
exports.findRubyVersion = findRubyVersion;
function downloadTruffleRuby(version) {
    return __awaiter(this, void 0, void 0, function* () {
        const arch = os.arch();
        const platform = os.platform();
        const convertedArch = arch == 'x64' ? 'amd64' : arch;
        const convertedPlatform = platform == 'darwin' ? 'macos' : platform;
        const fileName = `truffleruby-${version}-${convertedPlatform}-${convertedArch}`;
        const baseUrl = 'https://github.com/oracle/truffleruby/releases/download';
        const downloadUrl = `${baseUrl}/vm-${version}/${fileName}.tar.gz`;
        let downloadPath = yield tc.downloadTool(downloadUrl);
        let extractedPath = yield tc.extractTar(downloadPath);
        // truffleruby extracts with a root folder that matches the fileName downloaded
        let toolRoot = path.join(extractedPath, fileName);
        // Run the post-install hook
        yield exec.exec(path.join(toolRoot, 'lib/truffle/post_install_hook.sh'));
        // Install into the local tool cache
        return yield tc.cacheDir(toolRoot, 'truffleruby', version);
    });
}
