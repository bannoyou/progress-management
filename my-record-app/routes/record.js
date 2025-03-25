// 「達成」ボタンを押すとデータベースにポイントを追加する
const express = require('express');
const router = express.Router();
const pool = require('../db'); // MySQL接続用プール

// 課題達成処理
router.post('/achieve', async (req, res) => {
    const { userId, mainTaskId, subTaskId } = req.body;

    try {
        const [rows] = await pool.query(`
            SELECT completed FROM user_tasks 
            WHERE user_id = ? AND main_task_id = ? AND sub_task_id = ?
        `, [userId, mainTaskId, subTaskId]);

        console.log(req.body);

        if (rows.length > 0 && !rows[0].completed) {
            await pool.query(`
                UPDATE user_tasks 
                SET completed = true 
                WHERE user_id = ? AND main_task_id = ? AND sub_task_id = ?
            `, [userId, mainTaskId, subTaskId]);

            await pool.query(`
                UPDATE users 
                SET points = points + 10 
                WHERE id = ?
            `, [userId]);

            // 更新後の進捗率を取得
            const [completedTasksRows] = await pool.query(`
                SELECT COUNT(*) AS completedCount FROM user_tasks 
                WHERE user_id = ? AND main_task_id = ? AND completed = true
            `, [userId, mainTaskId]);

            const completedCount = completedTasksRows[0].completedCount;

            const [subTasks] = await pool.query(`
                SELECT COUNT(*) AS total FROM sub_tasks WHERE main_task_id = ?
            `, [mainTaskId]);

            const totalSubTasks = subTasks[0].total;
            const progress = totalSubTasks > 0 ? Math.round((completedCount / totalSubTasks) * 100) : 0;

            return res.json({ success: true, progress });
        } else {
            return res.json({ success: false, message: '既に達成済みです。' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'エラーが発生しました。' });
    }
});


// メインタスク、サブタスク、プログレスバーのデータを取得
router.get('/:mainTaskId', async (req, res) => {
    const mainTaskId = req.params.mainTaskId;
    const userId = req.session.userid; 
    console.log(userId);

    try {
        // メインタスクを取得
        const [mainTaskRows] = await pool.query('SELECT * FROM main_tasks WHERE id = ?', [mainTaskId]);
        const mainTask = mainTaskRows[0];

        // サブタスクを取得
        const [subTasks] = await pool.query('SELECT * FROM sub_tasks WHERE main_task_id = ?', [mainTaskId]);

        // 完了済みのサブタスク数を取得
        const [completedTasksRows] = await pool.query(`
            SELECT COUNT(*) AS completedCount FROM user_tasks 
            WHERE user_id = ? AND main_task_id = ? AND completed = true
        `, [userId, mainTaskId]);
        const completedCount = completedTasksRows[0].completedCount;

        // 進捗率を計算
        const totalSubTasks = subTasks.length;
        const progress = totalSubTasks > 0 ? Math.round((completedCount / totalSubTasks) * 100) : 0;
        
        console.log(progress);

        // 画像のパスを決定
        let imagePath;
        if (mainTaskId === '1') {
            imagePath = '/img/c.png';
        } else if (mainTaskId === '2') {
            imagePath = '/img/HTML.png';
        } else if (mainTaskId === '3') {
            imagePath = '/img/Python.png';
        } else if (mainTaskId === '4') {
            imagePath = '/img/mysql.png';
        } else {
            imagePath = '/Img/default.png'; // デフォルト画像
        }

        // テンプレートにデータを渡す
        res.render('record', { mainTask, subTasks, progress, userId, imagePath });
    } catch (error) {
        console.error(error);
        res.status(500).send('サーバーエラー');
    }
});

module.exports = router;

