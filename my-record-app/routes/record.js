// 「達成」ボタンを押すとデータベースにポイントを追加する
const express = require('express');
const router = express.Router();
const pool = require('../db'); // MySQL接続用プール

// 課題達成処理
router.post('/achieve', async (req, res) => {
    const { userId, mainTaskId, subTaskId } = req.body;

    try {
        // 既に達成済みでないことを確認
        const [rows] = await pool.query(`
            SELECT completed FROM user_tasks 
            WHERE user_id = ? AND main_task_id = ? AND sub_task_id = ?
        `, [userId, mainTaskId, subTaskId]);

        if (rows.length > 0 && !rows[0].completed) {
            // タスクを達成済みに更新
            await pool.query(`
                UPDATE user_tasks 
                SET completed = true 
                WHERE user_id = ? AND main_task_id = ? AND sub_task_id = ?
            `, [userId, mainTaskId, subTaskId]);

            // ポイントをユーザーに追加（ポイントの量は適宜調整）
            await pool.query(`
                UPDATE users 
                SET points = points + 10 
                WHERE id = ?
            `, [userId]);

            // res.json({ success: true, message: 'タスクを達成しました！' });

            // recordページにリダイレクト
            res.redirect('http://localhost:3000/record/1');

        } else {
            // res.json({ success: false, message: '既に達成済みです。' });

            // recordページにリダイレクト
            res.redirect('http://localhost:3000/record/1');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'エラーが発生しました。' });
    }
});

module.exports = router;

// メインタスク、サブタスク、プログレスバーのデータを取得
router.get('/:mainTaskId', async (req, res) => {
    const mainTaskId = req.params.mainTaskId;
    const userId = req.user ? req.user.id : 1; // 仮のユーザーIDを1と設定

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

        // テンプレートにデータを渡す
        res.render('record', { mainTask, subTasks, progress, userId });
    } catch (error) {
        console.error(error);
        res.status(500).send('サーバーエラー');
    }
});



