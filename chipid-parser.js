// CHIPID解析工具 - 纯JavaScript版本
// 可以在浏览器中直接运行，无需后端

class ChipIDParser {
    /**
     * 解析32位十六进制CHIPID
     * @param {string} chipid - 32位十六进制字符串
     * @returns {object} 解析结果
     * @throws {Error} 解析错误
     */
    static parse(chipid) {
        // 去除空格并转大写
        chipid = chipid.trim().toUpperCase();

        // 验证长度
        if (!chipid) {
            throw new Error("CHIPID不能为空");
        }

        if (chipid.length !== 32) {
            throw new Error(
                `CHIPID长度错误: 期望32位，实际${chipid.length}位。请提供完整的32位十六进制字符串`
            );
        }

        // 验证十六进制格式
        if (!/^[0-9A-F]{32}$/.test(chipid)) {
            throw new Error("CHIPID包含非法字符: 只允许0-9和A-F");
        }

        // 解析Lot ID (位置0-11, 6字节)
        let lot = "";
        for (let i = 0; i < 12; i += 2) {
            const byteVal = parseInt(chipid.substring(i, i + 2), 16);
            if (byteVal >= 32 && byteVal <= 126) {
                // 可打印ASCII字符
                lot += String.fromCharCode(byteVal);
            } else {
                // 不可打印字符，显示为\xNN
                lot += `\\x${byteVal.toString(16).padStart(2, '0')}`;
            }
        }

        // 解析Wafer编号 (位置12-13, 1字节)
        const wafer = parseInt(chipid.substring(12, 14), 16);
        if (wafer < 1 || wafer > 25) {
            throw new Error(
                `Wafer编号超出有效范围: ${wafer}。有效范围为1-25`
            );
        }

        // 解析X坐标 (位置14-15)
        const x = parseInt(chipid.substring(14, 16), 16);

        // 解析Y坐标 (位置18-19)
        const y = parseInt(chipid.substring(18, 20), 16);

        // 生成ECID: Lot_Wafer(2位)_X_Y
        const ecid = `${lot}_${wafer.toString().padStart(2, '0')}_${x}_${y}`;

        // 查询芯片分类信息（如果有ChipClassificationDB）
        let classification = null;
        if (typeof ChipClassificationDB !== 'undefined') {
            classification = ChipClassificationDB.lookup(lot, wafer);
        }

        const result = {
            lot: lot,
            wafer: wafer,
            x: x,
            y: y,
            ecid: ecid,
            raw: chipid
        };

        // 如果找到分类信息，添加到结果中
        if (classification) {
            result.priority = classification.priority;
            result.status = classification.status;
            result.description = classification.description;
        } else {
            // 未找到分类，默认为普通量产芯片
            result.priority = "Normal Production";
            result.status = "量产";
            result.description = "正常量产芯片，覆盖率99+%";
        }

        return result;
    }

    /**
     * 从文本中提取CHIPID
     * @param {string} text - 包含CHIPID的文本
     * @returns {string} 提取的CHIPID
     */
    static extractChipID(text) {
        // 移除空格和分隔符
        text = text.replace(/[\s\-_:]/g, '');

        // 查找32位十六进制字符串
        const match = text.match(/[0-9A-Fa-f]{32}/);

        return match ? match[0] : text;
    }

    /**
     * 批量解析CHIPID
     * @param {string[]} chipids - CHIPID数组
     * @returns {object} 批量解析结果
     */
    static parseBatch(chipids) {
        const results = [];

        chipids.forEach((chipidInput, index) => {
            try {
                const chipid = this.extractChipID(chipidInput.trim());
                const result = this.parse(chipid);
                results.push({
                    success: true,
                    index: index + 1,
                    data: result
                });
            } catch (error) {
                results.push({
                    success: false,
                    index: index + 1,
                    error: error.message,
                    input: chipidInput.trim()
                });
            }
        });

        return {
            success: true,
            total: results.length,
            succeeded: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length,
            results: results
        };
    }
}

// 导出供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChipIDParser;
}
