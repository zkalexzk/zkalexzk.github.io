// 芯片分类数据库
// 根据Lot#和Wafer#查询Priority和Status信息

const ChipClassificationDB = {
    // 数据格式：Lot# -> [wafer范围列表]
    data: [
        { lot: "U6B902", wafers: [1], priority: "HR", status: "Golden wafer" },
        { lot: "U6B900", wafers: [13], priority: "HR", status: "Golden wafer" },
        { lot: "U6B900", wafers: [7], priority: "SHR", status: "Golden wafer" },
        { lot: "U6B900", wafers: [1], priority: "SHR", status: "Blind build" },
        { lot: "U6B900", wafers: [2, 3], priority: "SHR", status: "Blind build" },
        { lot: "U6B900", wafers: [4, 6], priority: "SHR", status: "ES96" },
        { lot: "U6B900", wafers: [21, 22], priority: "HR", status: "Corner" },
        { lot: "U6B900", wafers: [14, 15, 16, 17, 18], priority: "HR", status: "ES266" },
        { lot: "U6B900", wafers: [20, 23], priority: "HR", status: "Corner" },
        { lot: "U6B900", wafers: [24, 25], priority: "HR", status: "Corner" },
        { lot: "U6B900", wafers: [5], priority: "SHR", status: "Hold" },
        { lot: "U6B900", wafers: [19], priority: "HR", status: "Hold" },
        { lot: "U6B900", wafers: [8, 9, 10, 11, 12], priority: "SHR", status: "RA" },
        { lot: "U6B902", wafers: [10, 11, 12, 13, 14, 15, 16, 17], priority: "HR", status: "RA" },
        { lot: "U6B901", wafers: [1, 2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 21, 22, 23, 24, 25], priority: "HR", status: "RA->ES" },
        { lot: "U6B902", wafers: [2, 3, 4, 5, 6, 7, 8, 9], priority: "HR", status: "RA" },
        { lot: "U6B902", wafers: [18, 19, 20, 21, 22, 23], priority: "HR", status: "RA" },
        { lot: "U92R35", wafers: [4], priority: "HR", status: "RA" },
        { lot: "U6B901", wafers: [9, 10, 11, 12, 13, 14, 16, 17], priority: "HR", status: "RA->ES" },
        { lot: "U6B902", wafers: [24, 25], priority: "HR", status: "Hold" },
        { lot: "U6B903", wafers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], priority: "HR", status: "QS1407+RA" }
    ],

    /**
     * 查询芯片分类信息
     * @param {string} lot - Lot ID
     * @param {number} wafer - Wafer编号
     * @returns {object|null} 分类信息或null
     */
    lookup(lot, wafer) {
        // 标准化Lot ID（去除空格，转大写）
        lot = lot.trim().toUpperCase();

        for (const entry of this.data) {
            if (entry.lot === lot && entry.wafers.includes(wafer)) {
                return {
                    priority: entry.priority,
                    status: entry.status,
                    description: this.getStatusDescription(entry.status)
                };
            }
        }

        return null;
    },

    /**
     * 获取Status的描述信息
     * @param {string} status - 状态名称
     * @returns {string} 描述信息
     */
    getStatusDescription(status) {
        const descriptions = {
            "Golden wafer": "金片 - 最高质量标准片",
            "Blind build": "盲测批次",
            "ES96": "ES96早期工程批芯片",
            "ES266": "ES266工程批芯片",
            "Corner": "Corner测试批次",
            "Hold": "暂停/保留批次",
            "RA": "可靠性分析批次",
            "RA->ES": "可靠性分析转工程样品",
            "QS1407+RA": "QS1407质量标准+可靠性分析"
        };

        return descriptions[status] || status;
    },

    /**
     * 获取Priority的描述
     * @param {string} priority - 优先级
     * @returns {string} 描述信息
     */
    getPriorityDescription(priority) {
        const descriptions = {
            "HR": "高可靠性 (High Reliability)",
            "SHR": "超高可靠性 (Super High Reliability)"
        };

        return descriptions[priority] || priority;
    }
};

// 导出供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChipClassificationDB;
}
