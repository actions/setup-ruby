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
const path = __importStar(require("path"));
const IS_WINDOWS = process.platform === 'win32';
function findRubyVersion(version) {
    return __awaiter(this, void 0, void 0, function* () {
        const installDir = tc.find('Ruby', version);
        if (!installDir) {
            throw new Error(`Version ${version} not found`);
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
