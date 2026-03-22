import mongoose, {Document, Schema, HydratedDocument} from "mongoose";

// Temp placeholder Document, Schema } from "mongoose";

/**
 * Receipt - Чек (54-ФЗ)
 * Хранит информацию о сформированных чеках для налоговой
 */
export interface IReceipt extends Document {
    order: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    type: "payment" | "refund";
    status: "pending" | "sent" | "failed" | "cancelled";
    provider: "atol" | "my_tax" | "manual";
    fiscalData: {
        fiscalNumber?: string; // Фискальный номер чека
        fiscalSign?: string; // Фискальный признак
        fiscalDate?: Date; // Дата фискализации
        registrationNumber?: string; // Регистрационный номер ККТ
        factoryNumber?: string; // Заводской номер ККТ
    };
    items: {
        name: string;
        quantity: number;
        price: number;
        amount: number;
        taxRate: "none" | "vat0" | "vat10" | "vat20" | "vat110" | "vat120";
        paymentMethod: "full_prepayment" | "prepayment" | "advance" | "full_payment" | "partial_payment" | "credit" | "credit_payment";
        paymentObject: "commodity" | "excise" | "job" | "service" | "gambling_bet" | "gambling_prize" | "lottery" | "lottery_prize" | "intellectual_activity" | "payment" | "agent_commission" | "property_right" | "non_operating_gain" | "insurance_premium" | "sales_tax" | "resort_fee" | "property" | "operating_gain" | "insurance_premium_csf" | "insurance_premium_csf_additional" | "insurance_premium_csf_additional_2" | "insurance_premium_csf_additional_3" | "insurance_premium_csf_additional_4" | "insurance_premium_csf_additional_5" | "insurance_premium_csf_additional_6" | "insurance_premium_csf_additional_7" | "insurance_premium_csf_additional_8" | "insurance_premium_csf_additional_9" | "insurance_premium_csf_additional_10" | "insurance_premium_csf_additional_11" | "insurance_premium_csf_additional_12" | "insurance_premium_csf_additional_13" | "insurance_premium_csf_additional_14" | "insurance_premium_csf_additional_15" | "insurance_premium_csf_additional_16" | "insurance_premium_csf_additional_17" | "insurance_premium_csf_additional_18" | "insurance_premium_csf_additional_19" | "insurance_premium_csf_additional_20" | "insurance_premium_csf_additional_21" | "insurance_premium_csf_additional_22" | "insurance_premium_csf_additional_23" | "insurance_premium_csf_additional_24" | "insurance_premium_csf_additional_25" | "insurance_premium_csf_additional_26" | "insurance_premium_csf_additional_27" | "insurance_premium_csf_additional_28" | "insurance_premium_csf_additional_29" | "insurance_premium_csf_additional_30" | "insurance_premium_csf_additional_31" | "insurance_premium_csf_additional_32" | "insurance_premium_csf_additional_33" | "insurance_premium_csf_additional_34" | "insurance_premium_csf_additional_35" | "insurance_premium_csf_additional_36" | "insurance_premium_csf_additional_37" | "insurance_premium_csf_additional_38" | "insurance_premium_csf_additional_39" | "insurance_premium_csf_additional_40" | "insurance_premium_csf_additional_41" | "insurance_premium_csf_additional_42" | "insurance_premium_csf_additional_43" | "insurance_premium_csf_additional_44" | "insurance_premium_csf_additional_45" | "insurance_premium_csf_additional_46" | "insurance_premium_csf_additional_47" | "insurance_premium_csf_additional_48" | "insurance_premium_csf_additional_49" | "insurance_premium_csf_additional_50" | "insurance_premium_csf_additional_51" | "insurance_premium_csf_additional_52" | "insurance_premium_csf_additional_53" | "insurance_premium_csf_additional_54" | "insurance_premium_csf_additional_55" | "insurance_premium_csf_additional_56" | "insurance_premium_csf_additional_57" | "insurance_premium_csf_additional_58" | "insurance_premium_csf_additional_59" | "insurance_premium_csf_additional_60" | "insurance_premium_csf_additional_61" | "insurance_premium_csf_additional_62" | "insurance_premium_csf_additional_63" | "insurance_premium_csf_additional_64" | "insurance_premium_csf_additional_65" | "insurance_premium_csf_additional_66" | "insurance_premium_csf_additional_67" | "insurance_premium_csf_additional_68" | "insurance_premium_csf_additional_69" | "insurance_premium_csf_additional_70" | "insurance_premium_csf_additional_71" | "insurance_premium_csf_additional_72" | "insurance_premium_csf_additional_73" | "insurance_premium_csf_additional_74" | "insurance_premium_csf_additional_75" | "insurance_premium_csf_additional_76" | "insurance_premium_csf_additional_77" | "insurance_premium_csf_additional_78" | "insurance_premium_csf_additional_79" | "insurance_premium_csf_additional_80" | "insurance_premium_csf_additional_81" | "insurance_premium_csf_additional_82" | "insurance_premium_csf_additional_83" | "insurance_premium_csf_additional_84" | "insurance_premium_csf_additional_85" | "insurance_premium_csf_additional_86" | "insurance_premium_csf_additional_87" | "insurance_premium_csf_additional_88" | "insurance_premium_csf_additional_89" | "insurance_premium_csf_additional_90" | "insurance_premium_csf_additional_91" | "insurance_premium_csf_additional_92" | "insurance_premium_csf_additional_93" | "insurance_premium_csf_additional_94" | "insurance_premium_csf_additional_95" | "insurance_premium_csf_additional_96" | "insurance_premium_csf_additional_97" | "insurance_premium_csf_additional_98" | "insurance_premium_csf_additional_99" | "insurance_premium_csf_additional_100" | "insurance_premium_csf_additional_101" | "insurance_premium_csf_additional_102" | "insurance_premium_csf_additional_103" | "insurance_premium_csf_additional_104" | "insurance_premium_csf_additional_105" | "insurance_premium_csf_additional_106" | "insurance_premium_csf_additional_107" | "insurance_premium_csf_additional_108" | "insurance_premium_csf_additional_109" | "insurance_premium_csf_additional_110" | "insurance_premium_csf_additional_111" | "insurance_premium_csf_additional_112" | "insurance_premium_csf_additional_113" | "insurance_premium_csf_additional_114" | "insurance_premium_csf_additional_115" | "insurance_premium_csf_additional_116" | "insurance_premium_csf_additional_117" | "insurance_premium_csf_additional_118" | "insurance_premium_csf_additional_119" | "insurance_premium_csf_additional_120" | "insurance_premium_csf_additional_121" | "insurance_premium_csf_additional_122" | "insurance_premium_csf_additional_123" | "insurance_premium_csf_additional_124" | "insurance_premium_csf_additional_125" | "insurance_premium_csf_additional_126" | "insurance_premium_csf_additional_127" | "insurance_premium_csf_additional_128" | "insurance_premium_csf_additional_129" | "insurance_premium_csf_additional_130" | "insurance_premium_csf_additional_131" | "insurance_premium_csf_additional_132" | "insurance_premium_csf_additional_133" | "insurance_premium_csf_additional_134" | "insurance_premium_csf_additional_135" | "insurance_premium_csf_additional_136" | "insurance_premium_csf_additional_137" | "insurance_premium_csf_additional_138" | "insurance_premium_csf_additional_139" | "insurance_premium_csf_additional_140" | "insurance_premium_csf_additional_141" | "insurance_premium_csf_additional_142" | "insurance_premium_csf_additional_143" | "insurance_premium_csf_additional_144" | "insurance_premium_csf_additional_145" | "insurance_premium_csf_additional_146" | "insurance_premium_csf_additional_147" | "insurance_premium_csf_additional_148" | "insurance_premium_csf_additional_149" | "insurance_premium_csf_additional_150" | "insurance_premium_csf_additional_151" | "insurance_premium_csf_additional_152" | "insurance_premium_csf_additional_153" | "insurance_premium_csf_additional_154" | "insurance_premium_csf_additional_155" | "insurance_premium_csf_additional_156" | "insurance_premium_csf_additional_157" | "insurance_premium_csf_additional_158" | "insurance_premium_csf_additional_159" | "insurance_premium_csf_additional_160" | "insurance_premium_csf_additional_161" | "insurance_premium_csf_additional_162" | "insurance_premium_csf_additional_163" | "insurance_premium_csf_additional_164" | "insurance_premium_csf_additional_165" | "insurance_premium_csf_additional_166" | "insurance_premium_csf_additional_167" | "insurance_premium_csf_additional_168" | "insurance_premium_csf_additional_169" | "insurance_premium_csf_additional_170" | "insurance_premium_csf_additional_171" | "insurance_premium_csf_additional_172" | "insurance_premium_csf_additional_173" | "insurance_premium_csf_additional_174" | "insurance_premium_csf_additional_175" | "insurance_premium_csf_additional_176" | "insurance_premium_csf_additional_177" | "insurance_premium_csf_additional_178" | "insurance_premium_csf_additional_179" | "insurance_premium_csf_additional_180" | "insurance_premium_csf_additional_181" | "insurance_premium_csf_additional_182" | "insurance_premium_csf_additional_183" | "insurance_premium_csf_additional_184" | "insurance_premium_csf_additional_185" | "insurance_premium_csf_additional_186" | "insurance_premium_csf_additional_187" | "insurance_premium_csf_additional_188" | "insurance_premium_csf_additional_189" | "insurance_premium_csf_additional_190" | "insurance_premium_csf_additional_191" | "insurance_premium_csf_additional_192" | "insurance_premium_csf_additional_193" | "insurance_premium_csf_additional_194" | "insurance_premium_csf_additional_195" | "insurance_premium_csf_additional_196" | "insurance_premium_csf_additional_197" | "insurance_premium_csf_additional_198" | "insurance_premium_csf_additional_199" | "insurance_premium_csf_additional_200" | "insurance_premium_csf_additional_201" | "insurance_premium_csf_additional_202" | "insurance_premium_csf_additional_203" | "insurance_premium_csf_additional_204" | "insurance_premium_csf_additional_205" | "insurance_premium_csf_additional_206" | "insurance_premium_csf_additional_207" | "insurance_premium_csf_additional_208" | "insurance_premium_csf_additional_209" | "insurance_premium_csf_additional_210" | "insurance_premium_csf_additional_211" | "insurance_premium_csf_additional_212" | "insurance_premium_csf_additional_213" | "insurance_premium_csf_additional_214" | "insurance_premium_csf_additional_215" | "insurance_premium_csf_additional_216" | "insurance_premium_csf_additional_217" | "insurance_premium_csf_additional_218" | "insurance_premium_csf_additional_219" | "insurance_premium_csf_additional_220" | "insurance_premium_csf_additional_221" | "insurance_premium_csf_additional_222" | "insurance_premium_csf_additional_223" | "insurance_premium_csf_additional_224" | "insurance_premium_csf_additional_225" | "insurance_premium_csf_additional_226" | "insurance_premium_csf_additional_227" | "insurance_premium_csf_additional_228" | "insurance_premium_csf_additional_229" | "insurance_premium_csf_additional_230" | "insurance_premium_csf_additional_231" | "insurance_premium_csf_additional_232" | "insurance_premium_csf_additional_233" | "insurance_premium_csf_additional_234" | "insurance_premium_csf_additional_235" | "insurance_premium_csf_additional_236" | "insurance_premium_csf_additional_237" | "insurance_premium_csf_additional_238" | "insurance_premium_csf_additional_239" | "insurance_premium_csf_additional_240" | "insurance_premium_csf_additional_241" | "insurance_premium_csf_additional_242" | "insurance_premium_csf_additional_243" | "insurance_premium_csf_additional_244" | "insurance_premium_csf_additional_245" | "insurance_premium_csf_additional_246" | "insurance_premium_csf_additional_247" | "insurance_premium_csf_additional_248" | "insurance_premium_csf_additional_249" | "insurance_premium_csf_additional_250" | "insurance_premium_csf_additional_251" | "insurance_premium_csf_additional_252" | "insurance_premium_csf_additional_253" | "insurance_premium_csf_additional_254" | "insurance_premium_csf_additional_255";
    }[];
    payment: {
        form: "cash" | "electronic" | "prepaid" | "credit" | "other";
        amount: number;
    }[];
    total: number;
    vatTotal: number;
    customer: {
        email?: string;
        phone?: string;
        inn?: string;
        name?: string;
    };
    sno: "osn" | "usn_income" | "usn_income_outcome" | "patent" | "esi" | "npd";
    sentAt?: Date;
    error?: string;
    rawResponse?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

const ReceiptSchema = new Schema<IReceipt>(
    {
        order: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            index: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ["payment", "refund"],
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "sent", "failed", "cancelled"],
            default: "pending",
            index: true,
        },
        provider: {
            type: String,
            enum: ["atol", "my_tax", "manual"],
            required: true,
        },
        fiscalData: {
            fiscalNumber: String,
            fiscalSign: String,
            fiscalDate: Date,
            registrationNumber: String,
            factoryNumber: String,
        },
        items: [
            {
                name: {type: String, required: true},
                quantity: {type: Number, required: true, min: 0},
                price: {type: Number, required: true, min: 0},
                amount: {type: Number, required: true, min: 0},
                taxRate: {
                    type: String,
                    enum: ["none", "vat0", "vat10", "vat20", "vat110", "vat120"],
                    default: "none",
                },
                paymentMethod: {
                    type: String,
                    enum: [
                        "full_prepayment",
                        "prepayment",
                        "advance",
                        "full_payment",
                        "partial_payment",
                        "credit",
                        "credit_payment",
                    ],
                    default: "full_payment",
                },
                paymentObject: {
                    type: String,
                    enum: ["commodity", "service", "job", "property_right", "payment", "other"],
                    default: "service",
                },
            },
        ],
        payment: [
            {
                form: {
                    type: String,
                    enum: ["cash", "electronic", "prepaid", "credit", "other"],
                    required: true,
                },
                amount: {type: Number, required: true, min: 0},
            },
        ],
        total: {
            type: Number,
            required: true,
            min: 0,
        },
        vatTotal: {
            type: Number,
            default: 0,
            min: 0,
        },
        customer: {
            email: String,
            phone: String,
            inn: String,
            name: String,
        },
        sno: {
            type: String,
            enum: ["osn", "usn_income", "usn_income_outcome", "patent", "esi", "npd"],
            required: true,
        },
        sentAt: Date,
        error: String,
        rawResponse: Schema.Types.Mixed,
    },
    {
        timestamps: true,
    }
);

// Индексы для производительности
ReceiptSchema.index({order: 1});
ReceiptSchema.index({user: 1, createdAt: -1});
ReceiptSchema.index({status: 1, createdAt: -1});
ReceiptSchema.index({"fiscalData.fiscalNumber": 1});

export const Receipt =
    mongoose.models.Receipt || mongoose.model<IReceipt>("Receipt", ReceiptSchema);
