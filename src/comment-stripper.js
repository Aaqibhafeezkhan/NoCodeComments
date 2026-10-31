import { resolveLanguage } from './languages.js';

function isIdentifierChar(char){return Boolean(char)&&/[\w$]/.test(char);}
function previousSignificant(source,index){let i=index-1;while(i>=0&&/\s/.test(source[i]))i-=1;return i>=0?source[i]:'';}
function looksLikeRegexStart(source,index){const previous=previousSignificant(source,index);if(!previous)return true;return /[=(:,[!&|?{};+\-*%^~<>]/.test(previous);}
function keywordCommentStart(source,index,keyword){if(source.slice(index,index+keyword.length).toUpperCase()!==keyword)return false;const before=source[index-1],after=source[index+keyword.length];return!isIdentifierChar(before)&&!isIdentifierChar(after);}
function consumeString(source,start,delimiter){let i=start+delimiter.length;while(i<source.length){if(source.startsWith(delimiter,i))return i+delimiter.length;if(source[i]==='\\')i+=2;else i+=1;}return source.length;}
function consumeBlockComment(source,start,opening,closing){let i=start+opening.length;let depth=1;const nested=['/*','{-','/+','#=','#['].includes(opening);while(i<source.length){if(nested&&source.startsWith(opening,i)){depth+=1;i+=opening.length;continue;}if(source.startsWith(closing,i)){depth-=1;i+=closing.length;if(depth===0)return i;continue;}i+=1;}return source.length;}
function appendLineBreaks(source,start,end,output){const removed=source.slice(start,end);const breaks=removed.match(/\r\n|\r|\n/g);if(breaks)output.push(breaks.join(''));}
function matchesLineMarker(source,index,markers){for(const marker of markers.slice().sort((a,b)=>b.length-a.length))if(source.startsWith(marker,index))return marker;return'';}
function consumeRegex(source,start){let i=start+1,inClass=false;while(i<source.length){if(source[i]==='\\'){i+=2;continue;}if(source[i]==='[')inClass=true;if(source[i]===']')inClass=false;if(source[i]==='/'&&!inClass){i+=1;while(/[a-z]/i.test(source[i]||''))i+=1;break;}if(/\r|\n/.test(source[i]))break;i+=1;}return i;}

export function stripComments(code,language='generic'){
  if(typeof code!=='string'||code.length===0)return code;
  const profile=resolveLanguage(language),output=[];
  const tripleStrings=profile.triple?['"""',"'''"]:[];let i=0;
  while(i<code.length){
    const triple=tripleStrings.find(d=>code.startsWith(d,i));
    if(triple){const end=consumeString(code,i,triple);output.push(code.slice(i,end));i=end;continue;}
    if(profile.strings.includes(code[i])){const end=consumeString(code,i,code[i]);output.push(code.slice(i,end));i=end;continue;}
    if(profile.regex&&code[i]==='/'&&code[i+1]!=='/'&&code[i+1]!=='*'&&looksLikeRegexStart(code,i)){const end=consumeRegex(code,i);output.push(code.slice(i,end));i=end;continue;}
    let matched=false;
    for(const [opening,closing] of profile.block.slice().sort((a,b)=>b[0].length-a[0].length)){
      if(!code.startsWith(opening,i))continue;
      const end=consumeBlockComment(code,i,opening,closing);appendLineBreaks(code,i,end,output);i=end;matched=true;break;
    }
    if(matched)continue;
    const lineMarker=matchesLineMarker(code,i,profile.line);
    if(lineMarker){let end=i+lineMarker.length;while(end<code.length&&!/\r|\n/.test(code[end]))end+=1;i=end;continue;}
    if(profile.keywordLine){const keyword=profile.keywordLine.find(item=>keywordCommentStart(code,i,item));if(keyword){let end=i+keyword.length;while(end<code.length&&!/\r|\n/.test(code[end]))end+=1;i=end;continue;}}
    output.push(code[i]);i+=1;
  }
  return output.join('');
}

export function countRemovedComments(original,stripped){if(original===stripped)return 0;return Math.max(0,original.length-stripped.length);}
