const express=require('express');
const router=express.Router();
const db=require('../models/db');

router.get('/',(req,res)=>{
    const sql_1="select id,title from main_tasks;";
    db.query(sql_1,(error,results)=>{
        if (error) throw error;
        if (results.length>0){

            const sql_2="WITH user_progress AS (SELECT user_id, main_task_id, COUNT(CASE WHEN completed = TRUE THEN 1 END) * 100 / COUNT(*) AS progress_rate FROM user_tasks GROUP BY user_id, main_task_id), ranked_progress AS (SELECT user_id, main_task_id, progress_rate, ROW_NUMBER() OVER (PARTITION BY main_task_id ORDER BY progress_rate DESC) AS `rank` FROM user_progress) SELECT r.user_id, u.name AS user_name, r.main_task_id, r.progress_rate FROM ranked_progress r JOIN users u ON r.user_id = u.id WHERE r.`rank` <= 4 ORDER BY r.main_task_id, r.`rank`;"
            const main_tasks=results;

            db.query(sql_2,(error,results)=>{

                if (error) throw error;
                if (results.length>0){

                    
                    const progress_rank=results;
                    res.render('index',{titles:main_tasks,user_progress:progress_rank});
                    //console.log(main_tasks);
                    //console.log(progress_rank);

                }else{
                    res.redirect('/');
                }
            });            
        }else{
            
            res.redirect('/');
        }
    });
});


module.exports=router;