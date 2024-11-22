import db from "@/app/lib/db";

export async function GET() {
  try {
    const [trainers] = await db.query("SELECT * FROM trainer");
    if (!trainers) {
      return new Response(JSON.stringify({ message: "ไม่พบข้อมูล" }));
    }
    return new Response(JSON.stringify(trainers));
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }));
  }
}

export async function POST(request) {
    try {
      const {
        trainer_name,
        trainer_email,
        trainer_phone,
        trainer_exp,
      } = await request.json();
  
      // Insert query
      const [new_trainers] = await db.query(
        "INSERT INTO trainer (trainer_name, trainer_email, trainer_phone, trainer_exp) VALUES (?, ?, ?, ?)",
        [trainer_name, trainer_email, trainer_phone, trainer_exp]
      );
  
      // Check if the insert was successful
      if (new_trainers.affectedRows > 0) {
        return new Response(JSON.stringify({ message: "Trainer added successfully" }), { status: 200 });
      } else {
        return new Response(JSON.stringify({ error: "Error inserting trainer" }), { status: 400 });
      }
    } catch (err) {
      // Handle any errors that occur during the process
      return new Response(
        JSON.stringify({ error: err.message || "Internal Server Error" }),
        { status: 500 }
      );
    }
  }
  
