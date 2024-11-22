import db from "@/app/lib/db";

export async function GET() {
  try {
    const [trainers] = await db.query("SELECT * FROM Trainer");
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
        trainer_surname,
        trainer_email,
        trainer_password,
        trainer_phone,
        trainer_birthdate,
        trainer_gender,
        trainer_exp,
        trainer_status,
        trainer_startdate,
        trainer_endtdate,
      } = await request.json();
  
      // Insert query
      const [new_trainers] = await db.query(
        "INSERT INTO Trainer (trainer_name, trainer_surname, trainer_email, trainer_password, trainer_phone, trainer_birthdate, trainer_gender, trainer_exp, trainer_status, trainer_startdate, trainer_endtdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [trainer_name, trainer_surname, trainer_email, trainer_password, trainer_phone, trainer_birthdate, trainer_gender, trainer_exp, trainer_status, trainer_startdate, trainer_endtdate]
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
  
