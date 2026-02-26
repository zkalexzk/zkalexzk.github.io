// 芯片分类数据库
// 根据Lot#和Wafer#查询Priority和Status信息

const ChipClassificationDB = {
    // 数据格式：Lot# -> [wafer范围列表]
    data: [
        // Golden wafer - 参考wafer不出货
        { lot: "U6B902", wafers: [1], priority: "Hot Run", status: "Golden wafer", description: "参考wafer不出货" },
        { lot: "U6B900", wafers: [13], priority: "Hot Run", status: "Golden wafer", description: "参考wafer不出货" },
        { lot: "U6B900", wafers: [7], priority: "Super Hot Run", status: "Golden wafer", description: "参考wafer不出货" },

        // 盲封 - 未ATE测试，仅实验室测试
        { lot: "U6B900", wafers: [1], priority: "Super Hot Run", status: "盲封", description: "未ATE测试，仅实验室测试" },
        { lot: "U6B900", wafers: [2, 3], priority: "Super Hot Run", status: "盲封", description: "未ATE测试，仅实验室测试" },

        // ES96早期工程芯片
        { lot: "U6B900", wafers: [4, 6], priority: "Super Hot Run", status: "ES96早期工程芯片", description: "仅LBIST测试，覆盖率70%" },

        // Corner - 工艺Corner芯片，纯实验
        { lot: "U6B900", wafers: [21, 22], priority: "Hot Run", status: "Corner", description: "工艺Corner芯片，纯实验" },
        { lot: "U6B900", wafers: [20, 23], priority: "Hot Run", status: "Corner", description: "工艺Corner芯片，纯实验" },
        { lot: "U6B900", wafers: [24, 25], priority: "Hot Run", status: "Corner", description: "工艺Corner芯片，纯实验" },

        // ES266早期工程芯片
        { lot: "U6B900", wafers: [14, 15, 16, 17, 18], priority: "Hot Run", status: "ES266早期工程芯片", description: "ATE测试，覆盖率80%" },

        // 问题wafer - 良率问题未出货
        { lot: "U6B900", wafers: [5], priority: "Super Hot Run", status: "问题wafer", description: "良率问题未出货" },
        { lot: "U6B900", wafers: [19], priority: "Hot Run", status: "问题wafer", description: "良率问题未出货" },
        { lot: "U6B902", wafers: [24, 25], priority: "Hot Run", status: "问题wafer", description: "良率问题未出货" },

        // 可靠性实验芯片 - ATE测试，覆盖率90%
        { lot: "U6B900", wafers: [8, 9, 10, 11, 12], priority: "Super Hot Run", status: "可靠性实验芯片", description: "ATE测试，覆盖率90%" },
        { lot: "U6B902", wafers: [10, 11, 12, 13, 14, 15, 16, 17], priority: "Hot Run", status: "可靠性实验芯片", description: "ATE测试，覆盖率90%" },
        { lot: "U6B901", wafers: [1, 2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 21, 22, 23, 24, 25], priority: "Hot Run", status: "可靠性实验芯片", description: "ATE测试，覆盖率90%" },
        { lot: "U6B902", wafers: [2, 3, 4, 5, 6, 7, 8, 9], priority: "Hot Run", status: "可靠性实验芯片", description: "ATE测试，覆盖率90%" },
        { lot: "U6B902", wafers: [18, 19, 20, 21, 22, 23], priority: "Hot Run", status: "可靠性实验芯片", description: "ATE测试，覆盖率90%" },
        { lot: "U92R35", wafers: [4], priority: "Hot Run", status: "可靠性实验芯片", description: "ATE测试，覆盖率90%" },
        { lot: "U6B901", wafers: [9, 10, 11, 12, 13, 14, 16, 17], priority: "Hot Run", status: "可靠性实验芯片", description: "ATE测试，覆盖率90%" },

        // QS1407
        { lot: "U6B903", wafers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], priority: "Hot Run", status: "QS1407", description: "ATE测试，覆盖率95%" }
    ],

    /**
     * 查询芯片分类信息
     * @param {string} lot - Lot ID
     * @param {number} wafer - Wafer编号
     * @returns {object|null} 分类信息或null（返回null表示是普通量产芯片）
     */
    lookup(lot, wafer) {
        // 标准化Lot ID（去除空格，转大写）
        lot = lot.trim().toUpperCase();

        for (const entry of this.data) {
            if (entry.lot === lot && entry.wafers.includes(wafer)) {
                return {
                    priority: entry.priority,
                    status: entry.status,
                    description: entry.description
                };
            }
        }

        // 未找到匹配，返回null（表示是普通量产芯片）
        return null;
    },

    /**
     * 获取Priority的描述
     * @param {string} priority - 优先级
     * @returns {string} 描述信息
     */
    getPriorityDescription(priority) {
        const descriptions = {
            "Hot Run": "快速制程",
            "Super Hot Run": "超快制程",
            "Normal Production": "普通量产制程"
        };

        return descriptions[priority] || "";
    },

    /**
     * 获取Status的中文说明
     * @param {string} status - 状态名称
     * @returns {string} 说明
     */
    getStatusInfo(status) {
        const info = {
            "Golden wafer": "参考wafer不出货",
            "盲封": "未ATE测试，仅实验室测试",
            "ES96早期工程芯片": "仅LBIST测试，覆盖率70%",
            "ES266早期工程芯片": "ATE测试，覆盖率80%",
            "Corner": "工艺Corner芯片，纯实验",
            "问题wafer": "良率问题未出货",
            "可靠性实验芯片": "ATE测试，覆盖率90%",
            "QS1407": "ATE测试，覆盖率90%",
            "量产": "正常量产芯片，覆盖率99+%"
        };

        return info[status] || "";
    }
};

// 导出供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChipClassificationDB;
}
