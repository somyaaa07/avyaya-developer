import dbInit from "@/lib/dbInit";

export async function GET() {
  try {
    await dbInit();

    return Response.json({
      success: true,
      message: "Database connected and tables synced successfully",
    });
  } catch (error) {
    console.error("❌ DB SYNC ERROR:", error);

    return Response.json(
      {
        success: false,
        message: error.message,
        error: error.original?.sqlMessage || null,
      },
      { status: 500 }
    );
  }
}