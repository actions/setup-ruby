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
var Platform;
(function (Platform) {
    Platform[Platform["Windows"] = 0] = "Windows";
    Platform[Platform["MacOS"] = 1] = "MacOS";
    Platform[Platform["Linux"] = 2] = "Linux";
})(Platform = exports.Platform || (exports.Platform = {}));
function getPlatform() {
    switch (os.platform()) {
        case 'win32':
            return Platform.Windows;
        case 'darwin':
            return Platform.MacOS;
        case 'linux':
            return Platform.Linux;
        default:
            throw Error('Platform not recognized');
    }
}
exports.getPlatform = getPlatform;
function default_1(inputs, platform) {
    return __awaiter(this, void 0, void 0, function* () {
        const installDir = tc.find('Ruby', inputs.version);
        if (!installDir) {
            throw new Error(`Version ${inputs.version} not found`);
        }
        const toolPath = path.join(installDir, 'bin');
        if (platform !== Platform.Windows) {
            // Ruby / Gem heavily use the '#!/usr/bin/ruby' to find ruby, so this task needs to
            // replace that version of ruby so all the correct version of ruby gets selected
            // replace the default
            const dest = '/usr/bin/ruby';
            exec.exec('sudo ln', ['-sf', path.join(toolPath, 'ruby'), dest]); // replace any existing
        }
        //core.setOutput('ruby-location', toolPath);
        if (inputs.addToPath === 'true') {
            core.addPath(toolPath);
        }
    });
}
exports.default = default_1;
