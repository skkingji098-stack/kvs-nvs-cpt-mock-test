import { getDb } from './_firebase.mjs';
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
export default async (request) => {
  if (request.method!=='GET') return json({error:'Method not allowed'},405);
  try {
    const snap=await getDb().collection('testResults').where('testVersion','==','CPT-50-v1').orderBy('score','desc').limit(100).get();
    const results=snap.docs.map(d=>{const x=d.data();return {candidateName:String(x.candidateName||'').slice(0,60),score:Number(x.score)||0,correct:Number(x.correct)||0,wrong:Number(x.wrong)||0,skipped:Number(x.skipped)||0,accuracy:Number(x.accuracy)||0,passed:Boolean(x.passed),date:String(x.date||'')}}).filter(x=>x.candidateName && x.candidateName!=='Demo Candidate');
    results.sort((a,b)=>b.score-a.score||b.accuracy-a.accuracy);
    return json({results:results.slice(0,50)});
  } catch(e) { console.error('leaderboard error',e); return json({error:'Leaderboard temporarily unavailable'},500); }
};
