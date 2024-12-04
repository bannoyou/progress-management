const express=require('express');
const router=express.Router();
const db=require('../db');


router.get('/', async (req,res) => {
    // ログインチェック
    if (!req.session.userId) {
        // ログインしていない場合はリダイレクト
        return res.redirect('/');
    }
    
    try {
        // main_tasksテーブルからid,titleを取得
        const sql_1="select id,title from main_tasks;";
        const [results1] = await db.query(sql_1);
        var sql_2;
        var main_tasks
        if (results1.length>0){
            
            sql_2="SELECT r.user_id, u.name AS user_name, r.main_task_id, r.progress_rate FROM (SELECT user_id, main_task_id, progress_rate, @rank := IF(@current_main_task_id = main_task_id, @rank + 1, 1) AS `rank`, @current_main_task_id := main_task_id FROM (SELECT user_id, main_task_id, COUNT(CASE WHEN completed = TRUE THEN 1 END) * 100 / COUNT(*) AS progress_rate FROM user_tasks GROUP BY user_id, main_task_id) AS user_progress CROSS JOIN (SELECT @rank := 0, @current_main_task_id := NULL) AS vars ORDER BY main_task_id, progress_rate DESC) AS r JOIN users u ON r.user_id = u.id WHERE r.`rank` <= 4 ORDER BY r.main_task_id, r.`rank`;"
            console.log(sql_2);
            main_tasks=results1;       
        }else{  
            res.redirect('/');
        }
        console.log(sql_2);

        
        const [results] = await db.query(sql_2);
        if (results.length > 0) {
            const progress_rank = results;
            res.render('learning-history', { titles: main_tasks, user_progress: progress_rank });
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('サーバーエラーが発生しました');
    }
    
});

module.exports=router;