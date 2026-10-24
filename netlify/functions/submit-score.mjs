import { getDb } from './_firebase.mjs';
import { ANSWERS } from './answer-key.mjs';

const json = (data, status=200) => new Response(JSON.stringify(data), {status, headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
export default async (request) => {
  if (request.method !== 'POST') return json({error:'Method not allowed'},405);
  try {
    const body=await request.json();
    const candidateName=String(body.candidateName||'').trim().replace(/\s+/g,' ').slice(0,60);
    const answers=body.answers;
    if (!candidateName) return json({error:'Candidate name is required'},400);
    if (!Array.isArray(answers)||answers.length!==ANSWERS.length||answers.some(a=>a!==null&&(!Number.isInteger(a)||a<0||a>3))) return json({error:'Invalid answer sheet'},400);
    const correct=ANSWERS.reduce((n,a,i)=>n+(answers[i]===a?1:0),0);
    const wrong=answers.reduce((n,a,i)=>n+(a!==null&&a!==ANSWERS[i]?1:0),0);
    const skipped=ANSWERS.length-correct-wrong;
    const attempted=correct+wrong;
    const accuracy=attempted?Math.round(correct/attempted*100):0;
    const score=correct*2;
    const passed=score>=40;
    const date=new Date().toLocaleDateString('en-IN',{timeZone:'Asia/Kolkata'});
    const db=getDb();
    await db.collection('testResults').add({candidateName,score,correct,wrong,skipped,accuracy,passed,submittedAt:adminTimestamp(),date,testVersion:'CPT-50-v1'});
    return json({candidateName,score,correct,wrong,skipped,accuracy,passed,date});
  } catch (e) {
    console.error('submit-score error',e);
    return json({error:'Could not submit score. Check server configuration.'},500);
  }
};
function adminTimestamp(){ return new Date(); }
