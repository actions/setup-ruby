"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
const IS_MACOS = process.platform === 'darwin';
function installXcode(version, appleID, appleIDPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!IS_MACOS) {
            throw new Error(`${process.platform} is not supported!`);
        }
        if ((yield exec.exec('xcversion', ['select', version], {
            ignoreReturnCode: true
        })) != 0) {
            core.warning(`Xcode ${version} not avilable in local.`);
            if (!appleID) {
                throw new Error(`apple-id is required to download Xcode.`);
            }
            if (!appleIDPassword) {
                throw new Error(`apple-id-password is required to download Xcode.`);
            }
            yield exec.exec('xcversion', ['install', version], {
                env: Object.assign(Object.assign({}, process.env), { XCODE_INSTALL_USER: appleID, XCODE_INSTALL_PASSWORD: appleIDPassword })
            });
            yield exec.exec('xcversion', ['select', version]);
        }
        yield exec.exec(`sudo xcodebuild -license accept`);
    });
}
exports.installXcode = installXcode;
