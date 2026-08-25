const blocks=[
  {id:"liet",text:"liet"},{id:"iz",text:"iz"},{id:"ie",text:"ie"},{id:"pie",text:"pie"},{id:"pa",text:"pa"},{id:"ne",text:"ne"},{id:"maz",text:"maz"},
  {id:"at",text:"at"},{id:"pār",text:"pār"},{id:"uz",text:"uz"},{id:"no",text:"no"},{id:"ap",text:"ap"},{id:"a",text:"a"},
  {id:"oj",text:"oj"},{id:"ums",text:"ums"},{id:"ot",text:"ot"},{id:"ājs",text:"ājs"},{id:"oš",text:"oš"},{id:"ana",text:"ana"},
  {id:"īb",text:"īb"},{id:"īg",text:"īg"},{id:"s",text:"s"},{id:"aiz",text:"aiz"},
  {id:"nest",text:"nest"},{id:"celt",text:"celt"},{id:"vest",text:"vest"},{id:"likt",text:"likt"},{id:"rakt",text:"rakt"},
  {id:"iet",text:"iet"},{id:"ēst",text:"ēst"},{id:"dot",text:"dot"},{id:"šūt",text:"šūt"},{id:"sa",text:"sa"}
];

const words={
  ne:{meaning:"partikula vai saiklis nolieguma izteikšanai",parts:["ne"]},maz:{meaning:"nelielā skaitā, daudzumā vai mērā",parts:["maz"]},
  pie:{meaning:"prievārds tuvuma vai pievienojuma izteikšanai",parts:["pie"]},pa:{meaning:"prievārds vietas, virziena vai veida izteikšanai",parts:["pa"]},
  liet:{meaning:"virzīt šķidrumu vai ļaut tam plūst",parts:["liet"]},neliet:{meaning:"atturēties no liešanas",parts:["ne","liet"]},
  izliet:{meaning:"ļaut šķidrumam izplūst no trauka",parts:["iz","liet"]},ieliet:{meaning:"iepildīt šķidrumu traukā",parts:["ie","liet"]},
  pieliet:{meaning:"pievienot vēl šķidrumu",parts:["pie","liet"]},paliet:{meaning:"liet kādu brīdi vai nedaudz",parts:["pa","liet"]},
  mazliet:{meaning:"nedaudz, nelielā daudzumā",parts:["maz","liet"]},nemaz:{meaning:"it nekādā mērā",parts:["ne","maz"]},
  piene:{meaning:"dzeltenziedu asteru dzimtas lakstaugs",parts:["pie","ne"]},lietne:{meaning:"datorprogramma noteikta uzdevuma veikšanai",parts:["liet","ne"]},
  izlietne:{meaning:"trauks ar noteci mazgāšanai",parts:["iz","liet","ne"]},
  nest:{meaning:"turot vai balstot pārvietot no vienas vietas uz citu",parts:["nest"]},celt:{meaning:"virzīt vai pārvietot augšup",parts:["celt"]},
  vest:{meaning:"pavadot vai transportējot virzīt uz noteiktu vietu",parts:["vest"]},likt:{meaning:"novietot vai panākt kādu darbību",parts:["likt"]},
  rakt:{meaning:"veidot padziļinājumu, pārvietojot zemi",parts:["rakt"]}
};

function randomOptions(options,count=3){
  const shuffled=[...options];for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]]}return shuffled.slice(0,count);
}
const starterPieces=["pie","aiz","pār","ne","ie","iz","pa","ap","at","uz","no","sa"];
const starterSet=(...base)=>{const root=[...base].sort((a,b)=>[...b].length-[...a].length)[0];return{id:base.join("-"),root,base,first:starterPieces.filter(piece=>!base.includes(piece)),prefixes:starterPieces.filter(piece=>!base.includes(piece)).slice(0,7)}};
const starterFamilies=[
  starterSet("maz","liet","ne"),starterSet("maz","liet","pa"),starterSet("maz","liet","pie"),starterSet("maz","liet","uz"),
  starterSet("maz","ne","būt"),starterSet("maz","ne","celt"),starterSet("maz","ne","rakt"),starterSet("maz","ne","vērt"),
  starterSet("pie","ne","mīt"),starterSet("pie","ne","būt"),starterSet("pie","ne","celt"),starterSet("pie","ne","gult"),
  starterSet("ne","ība","būt"),starterSet("ne","pa","būt"),starterSet("ne","pa","celt"),starterSet("ne","pa","likt"),
  starterSet("ne","pa","rakt"),starterSet("ne","pa","vērt"),starterSet("ne","būt","celt"),starterSet("pa","vār","dot"),
  starterSet("pa","ma","sēt"),starterSet("pie","pa","sēt"),starterSet("sa","tum","sēt"),starterSet("sa","ra","dot"),
  starterSet("liet","pie","ne"),starterSet("liet","ne","būt"),starterSet("pa","no","sēt"),starterSet("maz","pa","sēt"),
  starterSet("maz","pa","spēt"),starterSet("maz","pa","nākt"),starterSet("maz","pa","mest"),starterSet("maz","pa","rast"),
  starterSet("maz","pa","segt"),starterSet("pie","pa","celt"),starterSet("ne","pa","gult"),starterSet("ne","pa","mīt")
];
starterFamilies.flatMap(family=>[...family.base,...family.first]).forEach(id=>{if(!blocks.some(block=>block.id===id))blocks.push({id,text:id})});
function randomStarter(previous=""){const eligible=starterFamilies.filter(family=>family.id!==previous);return eligible[Math.floor(Math.random()*eligible.length)]}
let activeFamily=randomStarter(),baseBlockIds=activeFamily.base;
function expansionThreshold(round){let total=0,gap=0;for(let index=0;index<=round;index++){gap=index===0?2:index===1?3:index===2?7:index===3?10:gap+2;total+=gap}return total}
function canBuildFrom(word,texts){const parts=new Uint8Array(word.length+1);parts.fill(255);parts[0]=0;for(let index=0;index<word.length;index++){if(parts[index]===255)continue;for(const text of texts)if(word.startsWith(text,index))parts[index+text.length]=Math.min(parts[index+text.length],parts[index]+1)}return parts[word.length]}
function canAlreadyBuildBlock(piece){const texts=[...unlockedBlocks].map(id=>blocks.find(block=>block.id===id)?.text||id),parts=canBuildFrom(piece,texts);return parts!==255&&parts>=2}
function canOfferExpansionBlock(piece){return!unlockedBlocks.has(piece)&&!reservedMissionRewards.has(piece)&&!canAlreadyBuildBlock(piece)}
function blocksTooSimilar(one,two){const a=[...one],b=[...two],shorter=Math.min(a.length,b.length);if(shorter<2)return false;const rows=Array.from({length:a.length+1},()=>new Uint8Array(b.length+1));for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)rows[i][j]=a[i-1]===b[j-1]?rows[i-1][j-1]+1:Math.max(rows[i-1][j],rows[i][j-1]);return rows[a.length][b.length]/shorter>=.75}
function countConstructibleWords(texts,target,excludeTexts=[]){
  const pieces=[...new Set(texts)].filter(Boolean),seen=new Set(),foundWords=new Set();let frontier=new Set([""]),operations=0;
  for(let depth=1;depth<=7&&frontier.size;depth++){
    const next=new Set();
    for(const prefix of frontier)for(const piece of pieces){if(++operations>120000)return foundWords.size;const candidate=prefix+piece;if(candidate.length>24||seen.has(candidate))continue;seen.add(candidate);next.add(candidate);if(tezaursDataset.has(candidate)&&(depth>=2||[...candidate].length>=3)&&(!excludeTexts.length||canBuildFrom(candidate,excludeTexts)===255)){foundWords.add(candidate);if(foundWords.size>=target)return foundWords.size}}
    frontier=next;
  }
  return foundWords.size;
}
function reachableWordCount(extraBlocks,target){const texts=[...new Set([...unlockedBlocks,...extraBlocks])].map(id=>blocks.find(block=>block.id===id)?.text||id),cacheKey=[...texts].sort().join("|")+":"+target;if(reachabilityCache.has(cacheKey))return reachabilityCache.get(cacheKey);const count=countConstructibleWords(texts,target);reachabilityCache.set(cacheKey,count);return count}
function newReachableWordCount(extraBlocks,target=12){const base=[...unlockedBlocks].map(id=>blocks.find(block=>block.id===id)?.text||id),expanded=[...new Set([...base,...extraBlocks])];return countConstructibleWords(expanded,target,base)}
function firstExamples(id){const baseTexts=baseBlockIds.map(blockId=>blocks.find(block=>block.id===blockId)?.text||blockId),withNew=[...baseTexts,id],examples=[];for(const word of tezaursWordList){if(examples.length===3)break;if(word.includes(activeFamily.root)&&canBuildFrom(word,withNew)!==255&&canBuildFrom(word,baseTexts)===255)examples.push(word)}return examples.join(" · ")||id+activeFamily.root}
function isCommonDictionaryWord(word){return Object.values(tezaursPos).some(set=>set.has(word))&&!tezaursDialectWords.has(word)&&!tezaursHistoricWords.has(word)}
function firstExpansionOptions(){
  const target=expansionThreshold(1),baseTexts=baseBlockIds.map(id=>blocks.find(block=>block.id===id)?.text||id),candidates=new Map(),add=(piece,word,suffix)=>{const length=[...piece].length;if((length!==2&&length!==3)||!canOfferExpansionBlock(piece))return;const withPiece=[...baseTexts,piece];if(canBuildFrom(word,baseTexts)!==255||canBuildFrom(word,withPiece)===255)return;const item=candidates.get(piece)||{id:piece,examples:[],common:new Set(),suffixes:0};if(item.examples.length<3&&!item.examples.includes(word))item.examples.push(word);if(isCommonDictionaryWord(word))item.common.add(word);if(suffix)item.suffixes++;candidates.set(piece,item)};
  for(const word of tezaursWordList){if([...word].length>18)continue;for(const source of baseTexts){if(word.length<=source.length)continue;if(word.startsWith(source))add(word.slice(source.length),word,true);if(word.endsWith(source))add(word.slice(0,-source.length),word,false)}}
  const ranked=[...candidates.values()].map(item=>({...item,random:Math.random()})).sort((a,b)=>(b.common.size-a.common.size)||(b.suffixes-a.suffixes)||(b.examples.length-a.examples.length)||(a.random-b.random)),shortlist=ranked.slice(0,36),eligible=shortlist.filter(item=>reachableWordCount([item.id],target)>=target),pool=(eligible.length>=3?eligible:shortlist).slice(0,18);
  const options=randomOptions(pool).map(item=>({blocks:[item.id],example:item.examples.join(" · ")}));if(options.length>=3)return options;
  const fallback=activeFamily.first.filter(id=>canOfferExpansionBlock(id)&&!options.some(option=>option.blocks[0]===id)).map(id=>({blocks:[id],example:firstExamples(id)}));return[...options,...randomOptions(fallback,3-options.length)];
}
function branchingOptions(){
  const root=activeFamily.root,available=randomOptions(["ne",...activeFamily.prefixes].filter(canOfferExpansionBlock),7),options=[];
  while(options.length<3&&available.length>1){const first=available.shift(),index=available.findIndex(second=>!blocksTooSimilar(first,second));if(index<0)continue;const second=available.splice(index,1)[0],pair=[first,second];options.push({blocks:pair,example:pair.map(id=>id+root).join(" · ")})}return options;
}
function familyOptions(){return randomOptions([
  {blocks:["oj","ums"],example:"lietojums · izlietojums"},{blocks:["ot","ājs"],example:"lietotājs · izlietotājs"},
  {blocks:["oš","ana"],example:"lietošana · izlietošana"},{blocks:["īb","a"],example:"lietība · nelietība"},
  {blocks:["īg","s"],example:"lietīgs · nelietīgs"}
]);}
function proceduralOptions(){
  const known=[...unlockedBlocks].map(id=>blocks.find(block=>block.id===id)?.text).filter(text=>text&&[...text].length>=2),candidates=new Map(),valid=/^[a-zāčēģīķļņšūž]+$/u,consonants=/^[bcčdfgģhjķklļmnņprsštvzž]+$/u,productiveEndings=new Set(["ums","ība","īgs","īga","ana","šana","ājs","ēja","niek","ais"]),guaranteedSingles=unlockRound===2,allowRareSingle=unlockRound>2&&Math.random()<.08;
  const add=(piece,source,word)=>{const length=[...piece].length;if(length<1||length>4||!valid.test(piece)||!canOfferExpansionBlock(piece)||(length===1&&unlockRound<2)||(length===1&&unlockRound>2&&!allowRareSingle))return;const item=candidates.get(piece)||{id:piece,sources:new Set(),examples:[]};item.sources.add(source);if(item.examples.length<3&&!item.examples.includes(word))item.examples.push(word);candidates.set(piece,item)};
  for(const word of tezaursWordList){if([...word].length>20||!valid.test(word))continue;for(const source of known){if(word.length<=source.length)continue;if(word.startsWith(source))add(word.slice(source.length),source,word);if(word.endsWith(source))add(word.slice(0,-source.length),source,word)}}
  const candidateValues=[...candidates.values()].filter(item=>productiveEndings.has(item.id)||[...item.id].length!==4||Math.random()<.25),ranked=candidateValues.map(item=>{const length=[...item.id].length,isCluster=length>=2&&length<=3&&consonants.test(item.id);return{...item,random:Math.random(),derivationBias:productiveEndings.has(item.id)?4:isCluster?2.5:0,sizeBias:length===3?3:length===2?2:length===4?0:1}}).sort((a,b)=>(b.derivationBias-a.derivationBias)||(b.sources.size-a.sources.size)||(b.sizeBias-a.sizeBias)||(a.random-b.random)),used=new Set(),options=[];
  const nextTarget=expansionThreshold(unlockRound+1);let attempts=0,singleUsed=false;
  if(guaranteedSingles){
    const singles=[...ranked.filter(item=>[...item.id].length===1)];
    for(const id of ["a","s","i","e","u","ā","ī"]){if(singles.length>=7)break;if(unlockedBlocks.has(id)||singles.some(item=>item.id===id))continue;singles.push({id,examples:[id]})}
    const mediumMap=new Map(ranked.filter(item=>[...item.id].length===2).map(item=>[item.id,item]));
    for(const id of ["ne","ie","iz","pa","ap","at","uz","no","sa"]){if(canOfferExpansionBlock(id)&&!mediumMap.has(id))mediumMap.set(id,{id,examples:[id]})}
    const mediums=[...mediumMap.values()],usedMediums=new Set(),rareOptions=[];
    for(const single of singles){if(rareOptions.length===3)break;const available=mediums.filter(item=>!usedMediums.has(item.id)),medium=available.find(item=>reachableWordCount([single.id,item.id],nextTarget)>=nextTarget)||available[0];if(!medium)break;usedMediums.add(medium.id);rareOptions.push({blocks:[single.id,medium.id],example:[single.examples?.[0],medium.examples?.[0]].filter(Boolean).join(" · ")})}
    return randomOptions(rareOptions);
  }
  const firstPool=ranked,secondPool=ranked;
  for(const first of firstPool){if(options.length===3||attempts>=80)break;if(used.has(first.id))continue;for(const second of secondPool){if(attempts>=80)break;if(used.has(second.id)||first.id===second.id||blocksTooSimilar(first.id,second.id))continue;const hasSingle=[...first.id].length===1||[...second.id].length===1;if(!guaranteedSingles&&hasSingle&&singleUsed)continue;attempts++;if(reachableWordCount([first.id,second.id],nextTarget)<nextTarget)continue;used.add(first.id);used.add(second.id);singleUsed=singleUsed||hasSingle;options.push({blocks:[first.id,second.id],example:[first.examples[0],second.examples[0]].filter(Boolean).join(" · ")});break}}
  if(options.length<3)for(const first of firstPool){if(options.length===3)break;if(used.has(first.id))continue;const second=secondPool.find(item=>!used.has(item.id)&&item.id!==first.id&&!blocksTooSimilar(first.id,item.id));if(!second)break;used.add(first.id);used.add(second.id);options.push({blocks:[first.id,second.id],example:[first.examples[0],second.examples[0]].filter(Boolean).join(" · ")})}
  return options.length===3?randomOptions(options):branchingOptions();
}
function currentUnlockRound(){
  if(unlockRound===0)return{threshold:expansionThreshold(0),kicker:"PIRMAIS PAPLAŠINĀJUMS",title:"Izvēlies jaunu klucīti",description:"Katra iespēja ir viens 2 burtu vidējais vai 3 burtu lielais klucītis.",options:firstExpansionOptions};
  if(unlockRound===2)return{threshold:expansionThreshold(2),kicker:"RETAIS PAPLAŠINĀJUMS",title:"Izvēlies reto komplektu",description:"Katrā iespējā ir viens zelta vienburta un viens 2 burtu vidējais klucītis.",options:proceduralOptions};
  return{threshold:expansionThreshold(unlockRound),kicker:`PAPLAŠINĀJUMS ${unlockRound+1}`,title:"Izvēlies divu klucīšu komplektu",description:"Katrs komplekts spēj aizvest līdz nākamajam atklājumu slieksnim.",options:proceduralOptions};
}
const tezaursWordList=window.TEZAURS_ALL_WORDS||window.TEZAURS_INDEX?.words||[];
const tezaursDataset=new Set(tezaursWordList);
const reachabilityCache=new Map();
const tezaursDialectWords=window.TEZAURS_DIALECTS||new Set(window.TEZAURS_INDEX?.apvidvardi||[]);
const tezaursHistoricWords=window.TEZAURS_HISTORIC||new Set();
const tezaursPos=window.TEZAURS_POS||{};
let selected=[],found=[],gameLog=[],message="Izvēlies klucīšus un atrodi pirmo vārdu.",hasError=false,isChecking=false,totalScore=0;

let unlockedBlocks=new Set(baseBlockIds),reservedMissionRewards=new Set(),unlockRound=0,pendingUnlock=false,pendingOptions=[],selectedLarge="",preparedExpansionKey="",preparedExpansionOptions=null,expansionPreparationHandle=0;
const $=selector=>document.querySelector(selector);
const assembly=$("#assembly"),blocksElement=$("#blocks"),feedback=$("#feedback"),wordPreview=$("#wordPreview"),discoveries=$("#discoveries");
const unlockNote=$("#unlockNote"),progressBar=$("#progressBar"),progressText=$("#progressText"),nextStep=$("#nextStep"),score=$("#score"),checkButton=$("#checkButton");
const canvas=$("#wordCanvas"),networkCount=$("#networkCount"),ctx=canvas.getContext("2d");
const levelModal=$("#levelModal"),unlockChoices=$("#unlockChoices");
const levelKicker=$("#levelKicker"),levelTitle=$("#levelTitle"),levelDescription=$("#levelDescription");
const mapAssembly=$("#mapAssembly"),mapBlocks=$("#mapBlocks"),mapWordPreview=$("#mapWordPreview"),mapCheckButton=$("#mapCheckButton"),mapFeedback=$("#mapFeedback");
const mapDiscoveries=$("#mapDiscoveries"),mapScore=$("#mapScore"),mapNextStep=$("#mapNextStep");
const missionList=$("#missionList"),missionCount=$("#missionCount");
const definitionToast=$("#definitionToast"),definitionWord=$("#definitionWord"),definitionText=$("#definitionText");let definitionTimer=0;const definitionChunks=new Map();

const posMissionKinds={
  noun:{singular:"lietvārdu",plural:"lietvārdus",min:2,max:3,reward:65},
  adjective:{singular:"īpašības vārdu",plural:"īpašības vārdus",min:2,max:3,reward:85},
  verb:{singular:"darbības vārdu",plural:"darbības vārdus",min:2,max:3,reward:70},
  adverb:{singular:"apstākļa vārdu",plural:"apstākļa vārdus",min:2,max:3,reward:90},
  particle:{singular:"partikulu",plural:"partikulas",min:1,max:2,reward:180},
  conjunction:{singular:"saikli",plural:"saikļus",min:1,max:2,reward:220}
};
let missionSerial=0,missionCompletedTotal=0,missionRefreshTimers=[];

function reachablePosCount(kind,limit=3){const set=tezaursPos[kind];if(!set)return 0;const texts=[...unlockedBlocks].map(id=>blocks.find(block=>block.id===id)?.text||id);let count=0;for(const word of set){if(found.includes(word))continue;const parts=canBuildFrom(word,texts);if(parts!==255&&(parts>=2||[...word].length>=3)&&++count>=limit)break}return count}
function makeMission(kind){
  const uid=++missionSerial,tier=Math.floor(missionCompletedTotal/3),rewardScale=1+tier*.12;
  if(kind==="discover"){const target=Math.min(12,3+tier+Math.floor(Math.random()*3)),reward=Math.round(target*45*rewardScale);return{uid,kind,title:`Atrodi ${target} jaunus vārdus`,target,progress:0,reward,match:()=>true,done:false,rewardBlock:""}}
  if(kind==="complex"){const requiredParts=Math.min(6,3+Math.floor(tier/2)),target=Math.min(5,1+Math.floor(tier/2)+Math.floor(Math.random()*2)),reward=Math.round(target*(110+requiredParts*15)*rewardScale);return{uid,kind,title:`Saliec ${target===1?"vārdu":target+" vārdus"} no ${requiredParts}+ daļām`,target,progress:0,reward,match:word=>words[word]?.parts.length>=requiredParts,done:false,rewardBlock:""}}
  const definition=posMissionKinds[kind],rare=kind==="particle"||kind==="conjunction",desired=definition.min+Math.floor(tier/(rare?3:2))+Math.floor(Math.random()*2),available=reachablePosCount(kind,desired),target=Math.max(1,Math.min(available,desired)),reward=Math.round(definition.reward*target*rewardScale);
  return{uid,kind,title:`Atrodi ${target} ${target===1?definition.singular:definition.plural}`,target,progress:0,reward,match:word=>Boolean(tezaursPos[kind]?.has(word)),done:false,rewardBlock:""};
}
function availableMissionKinds(excluded=new Set()){const kinds=["discover","complex",...Object.keys(posMissionKinds)].filter(kind=>!excluded.has(kind));return randomOptions(kinds.filter(kind=>!posMissionKinds[kind]||reachablePosCount(kind)>0),kinds.length)}
const missionRewardCandidates=["ums","ība","īgs","ana","šana","ājs","nt","pr","st","sk","tr","ne","ie","iz","pa","ap","at","uz","no","pie","aiz","sa","maz"];
function pickMissionRewardBlock(excluded=new Set()){const pool=missionRewardCandidates.filter(id=>!excluded.has(id)&&!unlockedBlocks.has(id)&&!canAlreadyBuildBlock(id));if(!pool.length)return"";return pool.map(id=>({id,count:newReachableWordCount([id]),random:Math.random()})).sort((a,b)=>b.count-a.count||a.random-b.random)[0].id}
function assignMissionRewards(items){reservedMissionRewards=new Set();items.forEach(mission=>{mission.rewardBlock=pickMissionRewardBlock(reservedMissionRewards);if(mission.rewardBlock)reservedMissionRewards.add(mission.rewardBlock)});return items}
function createMissionSet(){const kinds=availableMissionKinds(),chosen=[];while(chosen.length<3&&kinds.length){const index=Math.floor(Math.random()*kinds.length);chosen.push(kinds.splice(index,1)[0])}for(const fallback of ["discover","complex"]){if(chosen.length===3)break;if(!chosen.includes(fallback))chosen.push(fallback)}return assignMissionRewards(chosen.map(makeMission))}
let missions=createMissionSet();

function awardMissionBlock(reserved){
  const id=reserved||pickMissionRewardBlock();if(!id)return"";
  unlockedBlocks.add(id);if(!blocks.some(block=>block.id===id))blocks.push({id,text:id});gameLog.push({kind:"block",label:id,source:"MISIJAS BALVA"});reachabilityCache.clear();return id;
}
function updateMissions(word){
  const completed=[];missions.forEach(mission=>{if(mission.done||!mission.match(word))return;mission.progress++;if(mission.progress<mission.target)return;mission.done=true;mission.rewardBlock=awardMissionBlock(mission.rewardBlock);totalScore+=mission.reward;missionCompletedTotal++;completed.push(`${mission.title}: +${mission.reward}${mission.rewardBlock?` un ${mission.rewardBlock.toUpperCase()} klucītis`:""}`)});
  if(completed.length)message+=` Misija izpildīta — ${completed.join("; ")}.`;
  if(missions.every(mission=>mission.done)&&!missionRefreshTimers.length){message+=" Visas trīs misijas pabeigtas — drīz būs jauns komplekts.";missionRefreshTimers.push(setTimeout(()=>{missions=createMissionSet();missionRefreshTimers=[];renderUI()},1800))}
}

function showDefinition(word,definition){clearTimeout(definitionTimer);definitionWord.textContent=word.toUpperCase();definitionText.textContent=definition;definitionToast.classList.toggle("dialect",Boolean(words[word]?.apvidvards));definitionToast.classList.toggle("historic",Boolean(words[word]?.senvards));definitionToast.hidden=false;requestAnimationFrame(()=>definitionToast.classList.add("show"));definitionTimer=setTimeout(()=>{definitionToast.classList.remove("show");setTimeout(()=>definitionToast.hidden=true,260)},5200)}
async function enrichDefinition(word){const first=[...word][0],code=first.codePointAt(0).toString(16).padStart(4,"0");try{let chunk=definitionChunks.get(code);if(!chunk){const response=await fetch(`definitions/${code}.json?v=1`);if(!response.ok)throw new Error();chunk=await response.json();definitionChunks.set(code,chunk)}const definition=chunk[word]||words[word].meaning;if(definitionWord.textContent===word.toUpperCase()){words[word].meaning=definition;definitionText.textContent=definition;renderUI()}}catch{if(definitionWord.textContent===word.toUpperCase())definitionText.textContent=words[word].meaning}}

function currentWord(){return selected.map(id=>blocks.find(block=>block.id===id).text).join("")}
function addBlock(id){if(isChecking)return;selected.push(id);message="Kad vārds gatavs, pārbaudi to.";hasError=false;renderUI()}
function removeBlock(index){if(isChecking)return;selected.splice(index,1);message=selected.length?"Kad vārds gatavs, pārbaudi to.":"Izvēlies klucīšus un saliec vārdu.";hasError=false;renderUI()}

function expansionPreparationKey(){return`${unlockRound}:${[...unlockedBlocks].sort().join("|")}:${[...reservedMissionRewards].sort().join("|")}`}
function prepareExpansionOptions(round){
  const key=expansionPreparationKey();if(preparedExpansionKey===key||expansionPreparationHandle)return;
  const prepare=()=>{expansionPreparationHandle=0;if(pendingUnlock||expansionPreparationKey()!==key)return;preparedExpansionOptions=typeof round.options==="function"?round.options():round.options;preparedExpansionKey=key};
  expansionPreparationHandle="requestIdleCallback" in window?requestIdleCallback(prepare,{timeout:1200}):setTimeout(prepare,0);
}
function checkProgression(){
  const round=currentUnlockRound();if(pendingUnlock)return;if(found.length<round.threshold){if(round.threshold-found.length<=1)prepareExpansionOptions(round);return}
  const key=expansionPreparationKey();pendingOptions=preparedExpansionKey===key&&preparedExpansionOptions?preparedExpansionOptions:(typeof round.options==="function"?round.options():round.options);preparedExpansionKey="";preparedExpansionOptions=null;
  pendingUnlock=true;levelModal.hidden=false;levelKicker.textContent=round.kicker;levelTitle.textContent=round.title;levelDescription.textContent=round.description;
  unlockChoices.innerHTML=pendingOptions.map((option,index)=>`<button type="button" data-unlock-option="${index}"><b>${option.blocks.map(block=>`<span class="${[...block].length===1?"single-letter":""}">${block.toUpperCase()}</span>`).join("<i>+</i>")}</b><small>Piemēri: ${option.example}</small></button>`).join("");
}

function chooseUnlock(optionIndex){
  const option=pendingOptions[optionIndex];if(!pendingUnlock||!option)return;
  option.blocks.forEach(id=>unlockedBlocks.add(id));if(unlockRound===0)selectedLarge=option.blocks[0];unlockRound++;pendingUnlock=false;pendingOptions=[];preparedExpansionKey="";preparedExpansionOptions=null;levelModal.hidden=true;
  option.blocks.forEach(id=>{if(!blocks.some(block=>block.id===id))blocks.push({id,text:id})});
  option.blocks.forEach(id=>gameLog.push({kind:"block",label:id,source:`PAPLAŠINĀJUMS ${unlockRound}`}));
  message=`Atbloķēti: ${option.blocks.map(id=>id.toUpperCase()).join(" + ")}.`;
  checkProgression();renderUI();
}

async function validateInTezaurs(word){
  return{valid:tezaursDataset.has(word),source:`Tēzaura ${window.TEZAURS_INDEX.edition} filtrētā datu kopa`};
}

async function checkWord(){
  const current=currentWord();
  if(!current){message="Vispirms izvēlies vismaz vienu klucīti.";hasError=true;renderUI();return}
  if(selected.length<2&&[...current].length<3){message=`“${current}” nav derīgs: vajag vismaz 2 klucīšus vai 3 rakstzīmes.`;hasError=true;renderUI();return}
  if(found.includes(current)){message=`“${current}” jau ir atrasts.`;hasError=true;renderUI();return}
  isChecking=true;message=`Pārbaudu “${current}” Tēzaurā…`;hasError=false;renderUI();
  const result=await validateInTezaurs(current);isChecking=false;
  if(!result.valid){message=`“${current}” netika atrasts kā Tēzaura sugas vārds.`;hasError=true;renderUI();return}
  if(!words[current])words[current]={meaning:"Tēzaura datu kopas šķirklis",parts:[...selected]};
  const partCount=selected.length,baseScores=[0,40,100,220,400,650],baseScore=partCount<baseScores.length?baseScores[partCount]:650+(partCount-5)*300,isDialect=tezaursDialectWords.has(current),isHistoric=tezaursHistoricWords.has(current),earned=baseScore+(isDialect?120:0)+(isHistoric?150:0);
  words[current].points=earned;words[current].apvidvards=isDialect;words[current].senvards=isHistoric;totalScore+=earned;
  found.push(current);gameLog.push({kind:"word",label:current});selected=[];message=`Atrasts: ${current} — +${earned} punkti${isDialect?" · apvidvārds +120":""}${isHistoric?" · senvārds +150":""}.`;hasError=false;updateMissions(current);
  graph.add(current);checkProgression();renderUI();showDefinition(current,"Ielādē Tēzaura definīciju…");enrichDefinition(current);
}

function resetGame(){const previous=activeFamily.id;activeFamily=randomStarter(previous);baseBlockIds=activeFamily.base;selected=[];found=[];gameLog=[];totalScore=0;message=`Jauna sākuma saime: ${activeFamily.root.toUpperCase()}.`;hasError=false;isChecking=false;unlockedBlocks=new Set(baseBlockIds);unlockRound=0;pendingUnlock=false;pendingOptions=[];preparedExpansionKey="";preparedExpansionOptions=null;if(expansionPreparationHandle){if("cancelIdleCallback" in window)cancelIdleCallback(expansionPreparationHandle);else clearTimeout(expansionPreparationHandle);expansionPreparationHandle=0}selectedLarge="";missionRefreshTimers.forEach(clearTimeout);missionRefreshTimers=[];missionCompletedTotal=0;missions=createMissionSet();reachabilityCache.clear();clearTimeout(definitionTimer);definitionToast.classList.remove("show");definitionToast.hidden=true;levelModal.hidden=true;graph.clear();renderUI()}

function gameLogMarkup(){
  if(!gameLog.length)return'<div class="empty-state"><b>∴</b><span>VĒL NAV NOTIKUMU</span><small>Vārdi un iegūtie klucīši parādīsies šeit.</small></div>';
  return[...gameLog].reverse().map((entry,index)=>{
    if(entry.kind==="block")return`<div class="discovery log-block"><span>◆</span><div><b>${entry.label}</b><small>JAUNS KLUCĪTIS · ${entry.source}</small></div><em>+</em></div>`;
    const word=entry.label,data=words[word];return`<div class="discovery${data.apvidvards?" dialect":""}${data.senvards?" historic":""}"><span>${String(gameLog.length-index).padStart(2,"0")}</span><div><b>${word}</b><small>${data.meaning}${data.apvidvards?" · APVIDVĀRDS":""}${data.senvards?" · SENVĀRDS":""} · +${data.points||0}</small></div><em>✓</em></div>`;
  }).join("");
}

function renderUI(){
  const current=currentWord();assembly.classList.toggle("is-wrong",hasError);
  assembly.innerHTML=selected.length?selected.map((id,index)=>`<button class="assembled-block" data-remove-index="${index}">${id}</button>`).join(""):'<span class="placeholder">IZVĒLIES KLUCĪŠUS ZEMĀK</span>';
  wordPreview.textContent=current||"—";feedback.textContent=message;feedback.classList.toggle("error",hasError);checkButton.disabled=isChecking;
  mapWordPreview.textContent=current||"—";mapFeedback.textContent=message;mapFeedback.classList.toggle("error",hasError);mapCheckButton.disabled=isChecking;
  checkButton.innerHTML=isChecking?'PĀRBAUDU TĒZAURĀ… <span>◌</span>':'PĀRBAUDĪT VĀRDU <span>→</span>';
  mapCheckButton.innerHTML=isChecking?'PĀRBAUDU… <span>◌</span>':'PĀRBAUDĪT <span>→</span>';
  blocksElement.innerHTML=blocks.filter(block=>unlockedBlocks.has(block.id)).map(block=>`<button class="word-block${selected.includes(block.id)?" active":""}${[...block.text].length===1?" single-letter":""}" data-block="${block.id}">${block.text}</button>`).join("")+Array(3).fill('<span class="word-block locked">◆</span>').join("");
  mapAssembly.innerHTML=selected.length?selected.map((id,index)=>`<button data-map-remove="${index}">${id}</button>`).join(""):'<span>Izvēlies klucīšus zemāk</span>';
  mapBlocks.innerHTML=blocks.filter(block=>unlockedBlocks.has(block.id)).map(block=>`<button style="--letters:${[...block.text].length}" class="${selected.includes(block.id)?"active ":""}${[...block.text].length===1?"single-letter":""}" data-map-block="${block.id}">${block.text}</button>`).join("");
  unlockNote.hidden=!pendingUnlock;unlockNote.textContent=pendingUnlock?"✦ Sasniegts līmeņa slieksnis — izvēlies jaunu klucīti!":"";
  discoveries.innerHTML=gameLogMarkup();
  const growth=Math.min(found.length*8,100);progressBar.style.width=`${growth}%`;progressText.textContent=`${found.length} MEZGLI`;score.textContent=`${totalScore} PUNKTI`;
  const nextRound=currentUnlockRound();nextStep.textContent=pendingUnlock?"IZVĒLIES VIENU NO 3 IESPĒJĀM":`${Math.min(found.length,nextRound.threshold)}/${nextRound.threshold} LĪDZ PAPLAŠINĀJUMAM`;
  mapDiscoveries.innerHTML=discoveries.innerHTML;mapScore.textContent=`${totalScore} PUNKTI`;mapNextStep.textContent=nextStep.textContent;
  missionCount.textContent=`${missionCompletedTotal} IZPILDĪTAS · L${Math.floor(missionCompletedTotal/3)+1}`;missionList.innerHTML=missions.map(mission=>`<div class="mission${mission.done?" done":""}"><i>${mission.done?"✓":""}</i><div><b>${mission.title}</b><small>${mission.done?`SAŅEMTS: +${mission.reward} PUNKTI${mission.rewardBlock?` · <strong>${mission.rewardBlock.toUpperCase()}</strong> KLUCĪTIS`:""}`:`${mission.progress}/${mission.target} · BALVA: +${mission.reward} PUNKTI${mission.rewardBlock?` · <strong>${mission.rewardBlock.toUpperCase()}</strong> KLUCĪTIS`:""}`}</small></div></div>`).join("");
}

function sharedParts(a,b){const left=[...words[a].parts];return words[b].parts.reduce((n,p)=>{const i=left.indexOf(p);if(i<0)return n;left.splice(i,1);return n+1},0)}
function isDirectBuild(a,b){
  const aParts=words[a].parts,bParts=words[b].parts;if(Math.abs(aParts.length-bParts.length)!==1)return false;
  const shorter=aParts.length<bParts.length?aParts:bParts,longer=aParts.length>bParts.length?aParts:bParts;
  const isPrefix=shorter.every((part,index)=>part===longer[index]),isSuffix=shorter.every((part,index)=>part===longer[index+1]);
  return isPrefix||isSuffix;
}
function bestParent(word){const candidates=found.filter(item=>item!==word);let best=null,bestScore=-Infinity;candidates.forEach(candidate=>{const value=(isDirectBuild(word,candidate)?100:0)+sharedParts(word,candidate)*10-Math.abs(words[word].parts.length-words[candidate].parts.length);if(value>bestScore){bestScore=value;best=candidate}});return best}
const morphology=window.DLMDM_MORPHOLOGY||{};
const reduceGraphMotion=matchMedia("(prefers-reduced-motion: reduce)");
const morphologyRelationCache=new Map();
document.documentElement.dataset.morphologyLemmas=String(Object.keys(morphology).length);
function intersects(left=[],right=[]){const values=new Set(left);return right.some(value=>values.has(value))}
function morphologicalRelation(a,b){
  const cacheKey=`${a}\u0000${b}`;if(morphologyRelationCache.has(cacheKey))return morphologyRelationCache.get(cacheKey);
  const left=morphology[a],right=morphology[b];let relation=null;if(!left||!right){morphologyRelationCache.set(cacheKey,null);return null}
  if(left.parents.includes(b)){
    const compound=left.parentGroups.some(group=>group.type==="COMP"&&group.parents.includes(b));
    relation={from:b,to:a,kind:compound?"compound":"parent",score:compound?95:100};
  }else if(right.parents.includes(a)){
    const compound=right.parentGroups.some(group=>group.type==="COMP"&&group.parents.includes(a));
    relation={from:a,to:b,kind:compound?"compound":"parent",score:compound?95:100};
  }else if(intersects(left.subgroups,right.subgroups))relation={from:a,to:b,kind:"subgroup",score:70};
  else if(intersects(left.roots,right.roots))relation={from:a,to:b,kind:"root",score:65};
  else if(intersects(left.families,right.families))relation={from:a,to:b,kind:"family",score:35};
  morphologyRelationCache.set(cacheKey,relation);return relation;
}
function bestMorphologicalNeighbor(word,names){
  return names.filter(name=>name!==word).map(name=>({name,relation:morphologicalRelation(word,name)})).filter(item=>item.relation).sort((a,b)=>b.relation.score-a.relation.score)[0]?.name||null;
}
window.getMorphologicalRelation=morphologicalRelation;
function segmentsCross(a,b,c,d){const turn=(p,q,r)=>(q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x);return turn(a,b,c)*turn(a,b,d)<0&&turn(c,d,a)*turn(c,d,b)<0}

const graph={
  nodes:new Map(),links:[],drag:null,pan:null,width:900,height:620,dpr:1,temperature:0,lastOptimize:0,lastFrame:0,swapTargets:new Map(),layoutTargets:new Map(),camera:{x:0,y:0,scale:1},
  metrics(){const density=Math.max(0,this.nodes.size-4);return{w:Math.max(50,108-density*3.15),h:Math.max(28,46-density*1.15),font:Math.max(8,13.5-density*.25),subfont:Math.max(5.5,7.2-density*.09)}},
  resize(){const rect=canvas.getBoundingClientRect();this.dpr=Math.min(devicePixelRatio||1,2);this.width=Math.max(rect.width,320);this.height=Math.max(rect.height,420);canvas.width=Math.round(this.width*this.dpr);canvas.height=Math.round(this.height*this.dpr);ctx.setTransform(this.dpr,0,0,this.dpr,0,0);if(this.nodes.size)this.computeLayoutTargets()},
  setZoom(scale,screenX=this.width/2,screenY=this.height/2){const next=Math.max(.22,Math.min(2.5,scale)),worldX=(screenX-this.camera.x)/this.camera.scale,worldY=(screenY-this.camera.y)/this.camera.scale;this.camera.x=screenX-worldX*next;this.camera.y=screenY-worldY*next;this.camera.scale=next},
  resetView(){if(!this.nodes.size){this.camera={x:0,y:0,scale:1};return}const m=this.metrics(),list=[...this.nodes.values()],minX=Math.min(...list.map(n=>n.x))-m.w,maxX=Math.max(...list.map(n=>n.x))+m.w,minY=Math.min(...list.map(n=>n.y))-m.h,maxY=Math.max(...list.map(n=>n.y))+m.h,scale=Math.max(.22,Math.min(1.35,this.width/Math.max(maxX-minX+100,1),this.height/Math.max(maxY-minY+100,1)));this.camera.scale=scale;this.camera.x=this.width/2-(minX+maxX)/2*scale;this.camera.y=this.height/2-(minY+maxY)/2*scale},
  add(word){
    const parentWord=bestParent(word),parent=this.nodes.get(parentWord),angle=this.nodes.size*2.399;
    const x=parent?parent.x+Math.cos(angle)*190:this.width/2,y=parent?parent.y+Math.sin(angle)*190:this.height/2;
    this.nodes.set(word,{word,x,y,vx:Math.cos(angle)*7,vy:Math.sin(angle)*7,birth:performance.now()});
    this.temperature=1;
    this.rebuildLinks();
    this.placeNewNode(word,parentWord);
    this.computeLayoutTargets();
    [...this.nodes.values()].forEach((node,index)=>{node.vx+=Math.cos(index*2.1+this.nodes.size)*4;node.vy+=Math.sin(index*1.8+this.nodes.size)*4});
  },
  rebuildLinks(){
    const names=[...this.nodes.keys()];this.links=[];
    for(let i=0;i<names.length;i++)for(let j=i+1;j<names.length;j++)if(isDirectBuild(names[i],names[j])){
      const from=words[names[i]].parts.length<words[names[j]].parts.length?names[i]:names[j],to=from===names[i]?names[j]:names[i];
      this.links.push({from,to});
    }
  },
  placeNewNode(word,parentWord){
    const node=this.nodes.get(word),parent=this.nodes.get(parentWord),m=this.metrics();if(!node||!parent)return;let best={x:node.x,y:node.y,score:Infinity};const left=m.w/2+28,right=this.width-m.w/2-28,top=m.h/2+38,bottom=this.height-m.h/2-38;
    for(let row=0;row<8;row++)for(let column=0;column<12;column++){node.x=left+(right-left)*(column+.5*(row%2))/11.5;node.y=top+(bottom-top)*row/7;const nearest=[...this.nodes.values()].filter(other=>other!==node).reduce((min,other)=>Math.min(min,Math.hypot(node.x-other.x,node.y-other.y)),Infinity),parentDistance=parent?Math.hypot(node.x-parent.x,node.y-parent.y):0,score=this.crossingCount()*1000000+this.obstructionCount(m)*10000+Math.max(0,m.w+20-nearest)*500+parentDistance*.08;if(score<best.score)best={x:node.x,y:node.y,score}}
    node.x=best.x;node.y=best.y;
  },
  computeLayoutTargets(){
    const layers=new Map();this.nodes.forEach(node=>{const rank=words[node.word].parts.length;if(!layers.has(rank))layers.set(rank,[]);layers.get(rank).push(node)});const ranks=[...layers.keys()].sort((a,b)=>a-b),neighbors=new Map([...this.nodes.keys()].map(word=>[word,[]]));this.links.forEach(link=>{neighbors.get(link.from)?.push(link.to);neighbors.get(link.to)?.push(link.from)});layers.forEach(layer=>layer.sort((a,b)=>a.x-b.x));
    for(let pass=0;pass<12;pass++){const sweep=pass%2?ranks:[...ranks].reverse(),positions=new Map();layers.forEach(layer=>layer.forEach((node,index)=>positions.set(node.word,index)));sweep.forEach(rank=>layers.get(rank).sort((a,b)=>{const center=node=>{const linked=neighbors.get(node.word).filter(word=>positions.has(word));return linked.length?linked.reduce((sum,word)=>sum+positions.get(word),0)/linked.length:positions.get(node.word)};return center(a)-center(b)||a.x-b.x}));}
    this.layoutTargets.clear();const m=this.metrics(),largest=Math.max(...[...layers.values()].map(layer=>layer.length),1),worldWidth=Math.max(this.width-100,largest*(m.w+90)),rowGap=Math.max(190,Math.min(290,(this.height-140)/Math.max(ranks.length-1,1))),centerX=this.width/2,top=70,left=centerX-worldWidth/2,right=centerX+worldWidth/2;ranks.forEach((rank,row)=>{const layer=layers.get(rank),y=ranks.length===1?this.height/2:top+rowGap*row;layer.forEach((node,column)=>this.layoutTargets.set(node.word,{x:layer.length===1?centerX:left+(right-left)*column/(layer.length-1),y}))});
  },
  crossingCount(){let count=0;for(let i=0;i<this.links.length;i++)for(let j=i+1;j<this.links.length;j++){const one=this.links[i],two=this.links[j];if(one.from===two.from||one.from===two.to||one.to===two.from||one.to===two.to)continue;const a=this.nodes.get(one.from),b=this.nodes.get(one.to),c=this.nodes.get(two.from),d=this.nodes.get(two.to);if(a&&b&&c&&d&&segmentsCross(a,b,c,d))count++}return count},
  obstructionCount(m=this.metrics()){let count=0;const list=[...this.nodes.values()];this.links.forEach(link=>{const a=this.nodes.get(link.from),b=this.nodes.get(link.to);if(!a||!b)return;const ex=b.x-a.x,ey=b.y-a.y,length2=Math.max(ex*ex+ey*ey,1),length=Math.sqrt(length2),nx=-ey/length,ny=ex/length,clearance=Math.abs(nx)*m.w/2+Math.abs(ny)*m.h/2+24;list.forEach(node=>{if(node.word===a.word||node.word===b.word)return;const t=Math.max(0,Math.min(1,((node.x-a.x)*ex+(node.y-a.y)*ey)/length2)),px=a.x+ex*t,py=a.y+ey*t;if(Math.hypot(node.x-px,node.y-py)<clearance)count++})});return count},
  optimizeCrossings(now){
    if(now-this.lastOptimize<420||this.swapTargets.size)return;this.lastOptimize=now;const nodes=[...this.nodes.values()],baseline=this.crossingCount();if(!baseline)return;
    let best=null,bestCount=baseline;for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=nodes[i],b=nodes[j];if(words[a.word].parts.length!==words[b.word].parts.length)continue;const ax=a.x,ay=a.y,bx=b.x,by=b.y;a.x=bx;a.y=by;b.x=ax;b.y=ay;const count=this.crossingCount();a.x=ax;a.y=ay;b.x=bx;b.y=by;if(count<bestCount){bestCount=count;best=[a,b]}}
    if(best){const [a,b]=best,guideA=this.layoutTargets.get(a.word)||{x:a.x,y:a.y},guideB=this.layoutTargets.get(b.word)||{x:b.x,y:b.y};this.layoutTargets.set(a.word,{...guideB});this.layoutTargets.set(b.word,{...guideA});this.swapTargets.set(a.word,{...guideB});this.swapTargets.set(b.word,{...guideA});this.temperature=Math.max(this.temperature,.65)}
  },
  clear(){this.nodes.clear();this.links=[];this.drag=null;this.pan=null;this.temperature=0;this.swapTargets.clear();this.layoutTargets.clear();this.camera={x:0,y:0,scale:1}},
  step(now){
    this.optimizeCrossings(now);const list=[...this.nodes.values()],m=this.metrics(),crossings=this.crossingCount(),snapshot=new Map(list.map(node=>[node.word,{x:node.x,y:node.y}])),obstructions=this.obstructionCount(m);if(this.drag)this.temperature=Math.max(this.temperature,.55);else if(crossings||obstructions)this.temperature=Math.max(.24,this.temperature*.994);else this.temperature=Math.max(0,this.temperature*.991-.00035);
    const activity=.06+this.temperature*.94,forces=new Map(list.map(n=>[n.word,{x:0,y:0}]));
    for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++){
      const a=list[i],b=list[j];let dx=b.x-a.x,dy=b.y-a.y,d=Math.max(Math.hypot(dx,dy),8);dx/=d;dy/=d;
      const repel=Math.min(10,28000/(d*d)),fa=forces.get(a.word),fb=forces.get(b.word);fa.x-=dx*repel;fa.y-=dy*repel;fb.x+=dx*repel;fb.y+=dy*repel;
      const ox=m.w+18-Math.abs(b.x-a.x),oy=m.h+18-Math.abs(b.y-a.y);if(ox>0&&oy>0){const push=Math.min(12,Math.max(ox,oy)*.16);fa.x-=dx*push;fa.y-=dy*push;fb.x+=dx*push;fb.y+=dy*push}
    }
    this.links.forEach(link=>{const a=this.nodes.get(link.from),b=this.nodes.get(link.to);if(!a||!b)return;const ga=this.layoutTargets.get(a.word),gb=this.layoutTargets.get(b.word),rest=ga&&gb?Math.max(100,Math.hypot(ga.x-gb.x,ga.y-gb.y)):(this.nodes.size>15?105:140);let dx=a.x-b.x,dy=a.y-b.y,d=Math.max(Math.hypot(dx,dy),1),spring=(d-rest)*.009,fa=forces.get(a.word),fb=forces.get(b.word);fa.x-=dx/d*spring*.35;fa.y-=dy/d*spring*.35;fb.x+=dx/d*spring;fb.y+=dy/d*spring});
    this.links.forEach(link=>{const a=this.nodes.get(link.from),b=this.nodes.get(link.to);if(!a||!b)return;const ex=b.x-a.x,ey=b.y-a.y,length2=Math.max(ex*ex+ey*ey,1),length=Math.sqrt(length2),nx=-ey/length,ny=ex/length,clearance=Math.abs(nx)*m.w/2+Math.abs(ny)*m.h/2+24;list.forEach(node=>{if(node.word===a.word||node.word===b.word)return;const t=Math.max(0,Math.min(1,((node.x-a.x)*ex+(node.y-a.y)*ey)/length2));const px=a.x+ex*t,py=a.y+ey*t;let dx=node.x-px,dy=node.y-py,d=Math.hypot(dx,dy);if(d>=clearance)return;if(d<.01){dx=nx;dy=ny;d=1}const push=(clearance-d)*.115,ux=dx/d,uy=dy/d,fn=forces.get(node.word),fa=forces.get(a.word),fb=forces.get(b.word);fn.x+=ux*push;fn.y+=uy*push;fa.x-=ux*push*(1-t)*.32;fa.y-=uy*push*(1-t)*.32;fb.x-=ux*push*t*.32;fb.y-=uy*push*t*.32})});
    for(let i=0;i<this.links.length;i++)for(let j=i+1;j<this.links.length;j++){
      const one=this.links[i],two=this.links[j];if(one.from===two.from||one.from===two.to||one.to===two.from||one.to===two.to)continue;
      const a=this.nodes.get(one.from),b=this.nodes.get(one.to),c=this.nodes.get(two.from),d=this.nodes.get(two.to);if(!a||!b||!c||!d||!segmentsCross(a,b,c,d))continue;
      const dx=b.x-a.x,dy=b.y-a.y,length=Math.max(Math.hypot(dx,dy),1),nx=-dy/length,ny=dx/length,direction=((i+j)%2?1:-1),push=.7*this.temperature;
      [a,b].forEach(node=>{const f=forces.get(node.word);f.x+=nx*push*direction;f.y+=ny*push*direction});[c,d].forEach(node=>{const f=forces.get(node.word);f.x-=nx*push*direction;f.y-=ny*push*direction});
    }
    list.forEach((node,index)=>{const f=forces.get(node.word),mx=m.w/2+14,my=m.h/2+14,target=this.swapTargets.get(node.word),guide=this.layoutTargets.get(node.word);f.x+=(this.width/2-node.x)*.001;f.y+=(this.height/2-node.y)*.001;if(guide){f.x+=(guide.x-node.x)*.028;f.y+=(guide.y-node.y)*.05}if(target){f.x+=(target.x-node.x)*.045;f.y+=(target.y-node.y)*.045;if(Math.hypot(target.x-node.x,target.y-node.y)<8)this.swapTargets.delete(node.word)}if(this.temperature>.08){f.x+=Math.sin(now*.0006+index*2.2)*.018*this.temperature;f.y+=Math.cos(now*.0005+index*1.7)*.018*this.temperature}
      if(this.drag===node.word){node.vx=node.vy=0;return}const damping=this.temperature<.08?.82:.94;node.vx=(node.vx+f.x*activity)*damping;node.vy=(node.vy+f.y*activity)*damping;let speed=Math.hypot(node.vx,node.vy),force=Math.hypot(f.x*activity,f.y*activity);if(speed>9){node.vx=node.vx/speed*9;node.vy=node.vy/speed*9;speed=9}if(this.temperature<.04&&speed<.055&&force<.045){node.vx=0;node.vy=0}node.x+=node.vx;node.y+=node.vy;if(guide){const correction=Math.max(-4,Math.min(4,guide.y-node.y));node.y+=correction;if(Math.abs(guide.y-node.y)<.5){node.y=guide.y;node.vy=0}}});
    if(this.crossingCount()>crossings){list.forEach(node=>{const old=snapshot.get(node.word);node.x=old.x;node.y=old.y;node.vx*=-.12;node.vy*=-.12});this.temperature=Math.max(this.temperature,.4)}
  },
  draw(now){
    const m=this.metrics(),zoom=this.camera.scale;ctx.setTransform(this.dpr,0,0,this.dpr,0,0);ctx.clearRect(0,0,this.width,this.height);ctx.fillStyle="#080d12";ctx.fillRect(0,0,this.width,this.height);
    let grid=28*zoom;while(grid<14)grid*=2;const offsetX=((this.camera.x%grid)+grid)%grid,offsetY=((this.camera.y%grid)+grid)%grid;ctx.fillStyle="#20303a";for(let x=offsetX;x<this.width;x+=grid)for(let y=offsetY;y<this.height;y+=grid)ctx.fillRect(x,y,1,1);
    if(!this.nodes.size){ctx.fillStyle="#40515b";ctx.textAlign="center";ctx.font="10px Arial";ctx.fillText("TĪKLS SĀKS AUGT PĒC PIRMĀ ATKLĀJUMA",this.width/2,this.height/2);networkCount.textContent="0 MEZGLI";return}
    ctx.setTransform(this.dpr*zoom,0,0,this.dpr*zoom,this.dpr*this.camera.x,this.dpr*this.camera.y);ctx.shadowBlur=0;ctx.lineWidth=1.25/zoom;this.links.forEach(link=>{const a=this.nodes.get(link.from),b=this.nodes.get(link.to);if(!a||!b)return;const dx=b.x-a.x,dy=b.y-a.y,d=Math.max(Math.hypot(dx,dy),1),ux=dx/d,uy=dy/d;const border=Math.min(m.w*.48/Math.max(Math.abs(ux),.001),m.h*.48/Math.max(Math.abs(uy),.001),d*.35);const ax=a.x+ux*border,ay=a.y+uy*border,bx=b.x-ux*border,by=b.y-uy*border;const gradient=ctx.createLinearGradient(ax,ay,bx,by);gradient.addColorStop(0,"#193746");gradient.addColorStop(.5,"#315b6d");gradient.addColorStop(1,"#193746");ctx.strokeStyle=gradient;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke()});
    this.nodes.forEach(node=>{const pulse=Math.max(0,1-(now-node.birth)/700),w=m.w*(1+pulse*.12),h=m.h*(1+pulse*.12),x=node.x-w/2,y=node.y-h/2;ctx.fillStyle="#0c141c";ctx.strokeStyle="#8be6ff";ctx.lineWidth=2/zoom;ctx.beginPath();ctx.roundRect(x,y,w,h,Math.min(14,h/3));ctx.fill();ctx.stroke();ctx.fillStyle="#eff9ff";ctx.textAlign="center";ctx.textBaseline="middle";ctx.font=`700 ${m.font}px Arial`;ctx.fillText(node.word.toUpperCase(),node.x,node.y-h*.1);ctx.fillStyle="#62cfff";ctx.font=`${m.subfont}px Arial`;ctx.fillText(words[node.word].parts.join(" + ").toUpperCase(),node.x,node.y+h*.22)});
    const crossings=this.crossingCount();networkCount.textContent=`${this.nodes.size} ${this.nodes.size===1?"MEZGLS":"MEZGLI"} · ${crossings?`${crossings} KRUSTOJUMI`:this.temperature>.04?"KĀRTOJAS":"STABILS"}`;
  },
  frame(now){const count=this.nodes.size,interval=count>100?50:count>60?40:count>30?28:16;if(!this.lastFrame||now-this.lastFrame>=interval){this.lastFrame=now;this.step(now);this.draw(now)}requestAnimationFrame(time=>this.frame(time))}
};

function containsOrderedParts(a,b){const small=words[a].parts,big=words[b].parts;if(small.length>big.length)return false;for(let offset=0;offset<=big.length-small.length;offset++)if(small.every((part,index)=>part===big[offset+index]))return true;return false}
function isHighlightedNode(word){
  const selected=graph.selected;if(!selected)return true;if(word===selected)return true;
  if(word.includes(selected))return true;
  const selectedParts=words[selected]?.parts||[];if(selectedParts.length===1)return Boolean(words[word]?.parts.includes(selectedParts[0]));
  return graph.links.some(link=>(link.from===selected&&link.to===word)||(link.to===selected&&link.from===word));
}
function isHighlightedLink(link){if(!graph.selected)return true;const selectedParts=words[graph.selected]?.parts||[];return selectedParts.length===1?isHighlightedNode(link.from)&&isHighlightedNode(link.to):link.from===graph.selected||link.to===graph.selected}
Object.assign(graph,{
  selected:null,lastOrbitTime:0,
  metrics(){const density=Math.max(0,this.nodes.size-6);return{w:Math.max(64,104-density*1.8),h:Math.max(34,46-density*.55),font:Math.max(9,13-density*.12),subfont:Math.max(6,7-density*.04)}},
  arrangeTargets(){[...this.nodes.values()].forEach((node,index)=>{const angle=index*2.399963,radius=Math.sqrt(index)*92;node.targetX=this.width/2+Math.cos(angle)*radius;node.targetY=this.height/2+Math.sin(angle)*radius})},
  computeLayoutTargets(){this.arrangeTargets()},
  add(word){if(words[word].parts.length<2&&[...word].length<3)return;const index=this.nodes.size,angle=index*2.399963,neighborName=bestMorphologicalNeighbor(word,[...this.nodes.keys()]),neighbor=this.nodes.get(neighborName),centerX=(this.width/2-this.camera.x)/this.camera.scale,centerY=(this.height/2-this.camera.y)/this.camera.scale,x=neighbor?neighbor.x+Math.cos(angle)*170:centerX,y=neighbor?neighbor.y+Math.sin(angle)*170:centerY;this.nodes.set(word,{word,x,y,vx:Math.cos(angle)*4,vy:Math.sin(angle)*4,targetX:x,targetY:y,rotation:0,spinSpeed:(index%2?1:-1)*(.00014+(index%5)*.000012),birth:performance.now()});this.rebuildLinks();this.arrangeTargets();[...this.nodes.values()].forEach((node,nodeIndex)=>{node.vx+=Math.cos(nodeIndex*1.8)*1.8;node.vy+=Math.sin(nodeIndex*2.1)*1.8})},
  rebuildLinks(){
    const names=[...this.nodes.keys()],degree=new Map(names.map(name=>[name,0])),candidates=[];this.links=[];
    const connected=new Set(),connect=(from,to,kind="fallback",score=0)=>{const key=[from,to].sort().join("\u0000");if(connected.has(key))return;connected.add(key);this.links.push({from,to,kind,score,fallback:kind==="fallback"});degree.set(from,degree.get(from)+1);degree.set(to,degree.get(to)+1)};
    for(let i=0;i<names.length;i++)for(let j=i+1;j<names.length;j++){
      const relation=morphologicalRelation(names[i],names[j]);
      if(relation)candidates.push(relation);else if(isDirectBuild(names[i],names[j]))candidates.push({from:names[i],to:names[j],kind:"block",score:20});
    }
    candidates.filter(candidate=>candidate.score>=90).sort((a,b)=>b.score-a.score).forEach(candidate=>connect(candidate.from,candidate.to,candidate.kind,candidate.score));
    for(const name of names){
      if(degree.get(name)>0)continue;
      const best=candidates.filter(candidate=>(candidate.from===name||candidate.to===name)&&degree.get(candidate.from===name?candidate.to:candidate.from)<8).sort((a,b)=>b.score-a.score)[0];
      if(best){connect(best.from,best.to,best.kind,best.score);continue}
      let fallback="",fallbackScore=0;
      for(const other of names){if(other===name||degree.get(other)>=3)continue;const common=sharedParts(name,other);if(!common)continue;const score=common*100-Math.abs(words[name].parts.length-words[other].parts.length)*8;if(score>fallbackScore){fallbackScore=score;fallback=other}}
      if(fallback)connect(name,fallback,"fallback",fallbackScore);
    }
  },
  crossingCount(){return 0},obstructionCount(){return 0},optimizeCrossings(){},
  rotateConstellation(list,now){
    if(!this.lastOrbitTime){this.lastOrbitTime=now;return}const elapsed=Math.min(50,Math.max(0,now-this.lastOrbitTime));this.lastOrbitTime=now;
    if(list.length<2||this.drag||this.pan||this.selected||reduceGraphMotion.matches)return;
    const angle=elapsed*.00005,cos=Math.cos(angle),sin=Math.sin(angle),centerX=list.reduce((sum,node)=>sum+node.x,0)/list.length,centerY=list.reduce((sum,node)=>sum+node.y,0)/list.length,targetCenterX=list.reduce((sum,node)=>sum+node.targetX,0)/list.length,targetCenterY=list.reduce((sum,node)=>sum+node.targetY,0)/list.length;
    list.forEach((node,index)=>{const x=node.x-centerX,y=node.y-centerY,targetX=node.targetX-targetCenterX,targetY=node.targetY-targetCenterY,vx=node.vx,vy=node.vy;node.x=centerX+x*cos-y*sin;node.y=centerY+x*sin+y*cos;node.targetX=targetCenterX+targetX*cos-targetY*sin;node.targetY=targetCenterY+targetX*sin+targetY*cos;node.vx=vx*cos-vy*sin;node.vy=vx*sin+vy*cos;if(!Number.isFinite(node.spinSpeed))node.spinSpeed=(index%2?1:-1)*.00016;node.rotation=(node.rotation||0)+elapsed*node.spinSpeed});
  },
  clear(){this.nodes.clear();this.links=[];this.drag=null;this.pan=null;this.selected=null;this.lastOrbitTime=0;this.lastFrame=0;this.camera={x:0,y:0,scale:1}},
  step(now){const list=[...this.nodes.values()];this.rotateConstellation(list,now);for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++){const a=list[i],b=list[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.max(Math.hypot(dx,dy),12),ux=dx/d,uy=dy/d,repel=Math.min(8,18000/(d*d)),collision=d<150?(150-d)*.035:0,force=repel+collision;a.vx-=ux*force;a.vy-=uy*force;b.vx+=ux*force;b.vy+=uy*force}this.links.forEach(link=>{const a=this.nodes.get(link.from),b=this.nodes.get(link.to);if(!a||!b)return;const dx=b.x-a.x,dy=b.y-a.y,d=Math.max(Math.hypot(dx,dy),1),force=(d-190)*.0035;a.vx+=dx/d*force;a.vy+=dy/d*force;b.vx-=dx/d*force;b.vy-=dy/d*force});list.forEach(node=>{if(this.drag===node.word)return;node.vx=(node.vx+(node.targetX-node.x)*.001)*.92;node.vy=(node.vy+(node.targetY-node.y)*.001)*.92;const speed=Math.hypot(node.vx,node.vy);if(speed>5){node.vx=node.vx/speed*5;node.vy=node.vy/speed*5}node.x+=node.vx;node.y+=node.vy})},
  draw(now){const m=this.metrics(),zoom=this.camera.scale;ctx.setTransform(this.dpr,0,0,this.dpr,0,0);ctx.clearRect(0,0,this.width,this.height);ctx.fillStyle="#080d12";ctx.fillRect(0,0,this.width,this.height);let grid=28*zoom;while(grid<14)grid*=2;const ox=((this.camera.x%grid)+grid)%grid,oy=((this.camera.y%grid)+grid)%grid;ctx.fillStyle="#20303a";for(let x=ox;x<this.width;x+=grid)for(let y=oy;y<this.height;y+=grid)ctx.fillRect(x,y,1,1);if(!this.nodes.size){ctx.fillStyle="#40515b";ctx.textAlign="center";ctx.font="10px Arial";ctx.fillText("TĪKLS SĀKS AUGT PĒC PIRMĀ ATKLĀJUMA",this.width/2,this.height/2);networkCount.textContent="0 MEZGLI";return}ctx.setTransform(this.dpr*zoom,0,0,this.dpr*zoom,this.dpr*this.camera.x,this.dpr*this.camera.y);this.links.forEach(link=>{const a=this.nodes.get(link.from),b=this.nodes.get(link.to);if(!a||!b)return;const active=isHighlightedLink(link);ctx.globalAlpha=active?1:.08;ctx.strokeStyle=active?"#315b6d":"#193746";ctx.lineWidth=1.25/zoom;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.globalAlpha=1});this.nodes.forEach(node=>{const active=isHighlightedNode(node.word),pulse=Math.max(0,1-(now-node.birth)/700),w=m.w*(1+pulse*.1),h=m.h*(1+pulse*.1),isDialect=Boolean(words[node.word].apvidvards),isHistoric=Boolean(words[node.word].senvards),accent=isHistoric?"#e0b152":isDialect?"#63e69a":"#8be6ff",fill=isHistoric?"#1b160c":isDialect?"#0b1913":"#0c141c",title=isHistoric?"#ffe0a0":isDialect?"#b9ffd3":"#eff9ff",subtitle=isHistoric?"#e0b152":isDialect?"#63e69a":"#62cfff";ctx.save();ctx.translate(node.x,node.y);ctx.rotate(node.rotation||0);ctx.globalAlpha=active?1:.14;ctx.fillStyle=fill;ctx.strokeStyle=accent;ctx.lineWidth=(node.word===this.selected?2.7:1.8)/zoom;ctx.beginPath();ctx.roundRect(-w/2,-h/2,w,h,Math.min(12,h/3));ctx.fill();ctx.stroke();ctx.fillStyle=title;ctx.textAlign="center";ctx.textBaseline="middle";ctx.font=`700 ${m.font}px Arial`;ctx.fillText(node.word.toUpperCase(),0,-h*.1);ctx.fillStyle=subtitle;ctx.font=`${m.subfont}px Arial`;ctx.fillText(words[node.word].parts.join(" + ").toUpperCase(),0,h*.22);ctx.restore();ctx.globalAlpha=1});networkCount.textContent=`${this.nodes.size} MEZGLI · FLOATING`}
});

function screenPosition(event){const rect=canvas.getBoundingClientRect();return{x:event.clientX-rect.left,y:event.clientY-rect.top}}
function pointerPosition(event){const p=screenPosition(event);return{x:(p.x-graph.camera.x)/graph.camera.scale,y:(p.y-graph.camera.y)/graph.camera.scale}}
function showNodeDefinition(word){if(!words[word])return;showDefinition(word,words[word].meaning||"Ielādē Tēzaura definīciju…");enrichDefinition(word)}
canvas.addEventListener("pointerdown",event=>{const p=pointerPosition(event),screen=screenPosition(event),m=graph.metrics(),hit=[...graph.nodes.values()].reverse().find(n=>{const dx=p.x-n.x,dy=p.y-n.y,angle=-(n.rotation||0),localX=dx*Math.cos(angle)-dy*Math.sin(angle),localY=dx*Math.sin(angle)+dy*Math.cos(angle);return Math.abs(localX)<=m.w/2&&Math.abs(localY)<=m.h/2});if(hit){graph.drag=hit.word;graph.selected=hit.word;showNodeDefinition(hit.word)}else{graph.selected=null;graph.pan={x:screen.x,y:screen.y}}canvas.classList.add("dragging");canvas.setPointerCapture(event.pointerId)});
canvas.addEventListener("pointermove",event=>{if(graph.pan){const p=screenPosition(event);graph.camera.x+=p.x-graph.pan.x;graph.camera.y+=p.y-graph.pan.y;graph.pan=p;return}if(!graph.drag)return;const p=pointerPosition(event),node=graph.nodes.get(graph.drag),before=graph.crossingCount(),oldX=node.x,oldY=node.y;node.x=p.x;node.y=p.y;if(graph.crossingCount()>before){node.x=oldX;node.y=oldY}node.vx=node.vy=0});
function releasePointer(event){if(!graph.drag&&!graph.pan)return;const movedNode=Boolean(graph.drag);graph.drag=null;graph.pan=null;if(movedNode){graph.computeLayoutTargets();graph.temperature=Math.max(graph.temperature,.65);[...graph.nodes.values()].forEach((node,index)=>{node.vx+=Math.cos(index*1.8)*2;node.vy+=Math.sin(index*2.1)*2})}canvas.classList.remove("dragging");if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId)}
canvas.addEventListener("pointerup",releasePointer);canvas.addEventListener("pointercancel",releasePointer);
canvas.addEventListener("wheel",event=>{event.preventDefault();const p=screenPosition(event),factor=Math.exp(-event.deltaY*.0012);graph.setZoom(graph.camera.scale*factor,p.x,p.y)},{passive:false});
$("#zoomIn").addEventListener("click",()=>graph.setZoom(graph.camera.scale*1.25));
$("#zoomOut").addEventListener("click",()=>graph.setZoom(graph.camera.scale/1.25));
$("#resetView").addEventListener("click",()=>graph.resetView());

checkButton.addEventListener("click",checkWord);$("#resetButton").addEventListener("click",resetGame);
mapCheckButton.addEventListener("click",checkWord);
blocksElement.addEventListener("click",event=>{const button=event.target.closest("[data-block]");if(button)addBlock(button.dataset.block)});
mapBlocks.addEventListener("click",event=>{const button=event.target.closest("[data-map-block]");if(button)addBlock(button.dataset.mapBlock)});
assembly.addEventListener("click",event=>{const button=event.target.closest("[data-remove-index]");if(button)removeBlock(Number(button.dataset.removeIndex))});
mapAssembly.addEventListener("click",event=>{const button=event.target.closest("[data-map-remove]");if(button)removeBlock(Number(button.dataset.mapRemove))});
unlockChoices.addEventListener("click",event=>{const button=event.target.closest("[data-unlock-option]");if(button)chooseUnlock(Number(button.dataset.unlockOption))});
window.addEventListener("resize",()=>graph.resize());
graph.resize();renderUI();requestAnimationFrame(time=>graph.frame(time));
