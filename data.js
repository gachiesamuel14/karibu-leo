const COUNTIES = [
  "Nairobi","Mombasa","Kisumu","Kiambu","Nakuru","Uasin Gishu","Machakos",
  "Kajiado","Kilifi","Kisii","Nyeri","Meru","Kakamega","Bungoma","Kericho",
  "Laikipia","Narok","Kitui","Embu","Murang'a"
];

const TRIBES = ["Kikuyu","Luo","Luhya","Kalenjin","Kamba","Kisii","Meru","Mijikenda","Somali","Maasai","Other"];
const RELIGIONS = ["Christian","Muslim","Traditional","Spiritual","Prefer not to say"];
const INTERESTS = ["Afrobeats","Gospel","Football","Rugby","Hiking","Cooking","Church","Startup life","Fashion","Travel","Gym","Poetry","Farming","Photography","Dancehall"];
const MODES = ["Open","Student","Professional","Church"];

const SEED = [
  { id:"p1", name:"Amina", age:26, gender:"Woman", county:"Mombasa", town:"Nyali", tribe:"Swahili", religion:"Muslim", mode:"Professional",
    bio:"Coast vibes, chai at sunset, looking for someone kind and consistent.", interests:["Travel","Fashion","Cooking"],
    photo:"https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=80", km:4.2 },
  { id:"p2", name:"Brian", age:29, gender:"Man", county:"Nairobi", town:"Westlands", tribe:"Kikuyu", religion:"Christian", mode:"Professional",
    bio:"Product guy by day, rugby on weekends. Let's grab nyama choma in Lavington.", interests:["Rugby","Startup life","Gym"],
    photo:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80", km:2.8 },
  { id:"p3", name:"Wanjiku", age:24, gender:"Woman", county:"Kiambu", town:"Ruiru", tribe:"Kikuyu", religion:"Christian", mode:"Student",
    bio:"JKUAT final year. Soft life on a budget. Church on Sunday, brunch after.", interests:["Church","Poetry","Hiking"],
    photo:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80", km:11.5 },
  { id:"p4", name:"Otieno", age:31, gender:"Man", county:"Kisumu", town:"Milimani", tribe:"Luo", religion:"Christian", mode:"Professional",
    bio:"Lake energy. I cook a mean fish and I don't play about loyalty.", interests:["Football","Cooking","Travel"],
    photo:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80", km:18.0 },
  { id:"p5", name:"Faith", age:27, gender:"Woman", county:"Nakuru", town:"Milimani", tribe:"Kalenjin", religion:"Christian", mode:"Church",
    bio:"Runner, tea farmer's daughter, looking for peace not chaos.", interests:["Gym","Church","Hiking"],
    photo:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80", km:7.1 },
  { id:"p6", name:"Hassan", age:28, gender:"Man", county:"Nairobi", town:"Eastleigh", tribe:"Somali", religion:"Muslim", mode:"Professional",
    bio:"Quiet confidence. Business by day. Looking for someone with adab.", interests:["Fashion","Startup life","Travel"],
    photo:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80", km:5.6 },
  { id:"p7", name:"Mercy", age:23, gender:"Woman", county:"Uasin Gishu", town:"Eldoret", tribe:"Kalenjin", religion:"Christian", mode:"Student",
    bio:"Moi Uni. Track and field. If you can keep up, holla.", interests:["Gym","Afrobeats","Football"],
    photo:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80", km:9.4 },
  { id:"p8", name:"Kevin", age:33, gender:"Man", county:"Nairobi", town:"Kilimani", tribe:"Kamba", religion:"Christian", mode:"Professional",
    bio:"Architect. Sunday markets, vinyl, and long walks in Karura.", interests:["Photography","Hiking","Afrobeats"],
    photo:"https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=80", km:3.3 }
];
