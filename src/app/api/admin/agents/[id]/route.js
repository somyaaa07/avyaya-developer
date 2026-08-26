import { NextResponse } from 'next/server';
import dbInit from '@/lib/dbInit';
import Agent from '@/models/Agent';

export async function DELETE(req, { params }) {
  try{
    const { id } = await params;
    await dbInit();

    const agent = await Agent.findByPk(id);
    if(!agent){
      return NextResponse.json({
        error: 'Didnt find agent'
      }, {status: 404});

     
    }
     await agent.destroy();
     return NextResponse.json({message: 'Agent deleted'});
  }
  catch(error){
    console.error('Delete error:', error);
    return NextResponse.json({error: error.message},{status:500});
  }
}

export async function PUT(req, { params }){
  const { id } = await params;
  await dbInit();
  const body = await req.json();
  await Agent.update(body,{where:{id}});
  return NextResponse.json({message:'agent is now updated'});
}