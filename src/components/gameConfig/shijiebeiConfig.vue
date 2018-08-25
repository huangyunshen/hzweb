<template>
    <div class="game-config">
        <el-row>
            <el-col :offset="2" :span="20">
                <el-row>
                    <el-col :span="8">
                        <el-form
                            label-width="150px"
                            label-position="right"
                            @submit.native.prevent>

                            <el-form-item class="el-wallet-style" :label="$t('gamename')">
                                <el-input
                                    auto-complete="off"
                                    v-model="configData.name"
                                    maxlength="15"
                                >
                                </el-input>
                            </el-form-item>

                            <el-form-item class="el-wallet-style" :label="$t('typeofevent')">
                                <el-select v-model="configData.type" :placeholder="$t('pleasechoose')"
                                           style="width: 100%;" @change="setSession(configData.type)">
                                    <el-option
                                        v-for="item in types"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item class="el-wallet-style" :label="$t('competition')">
                                <el-select v-model="configData.id" :placeholder="$t('pleasechoose01')"
                                           style="width: 100%;" @change="setDefaultDeadline"
                                           :no-data-text="$t('pleasechoosethetypeofevent')">
                                    <el-option
                                        v-for="(item, key) in gameData"
                                        :key="key"
                                        :label="item.zhuTeam + ' VS ' + item.keTeam"
                                        :value="key">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item class="el-wallet-style" :label="$t('poolamount')">
                                <el-input
                                    auto-complete="off"
                                    v-model="configData.recharge"
                                >
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>

                    <el-col :span="8">
                        <el-form
                            label-width="150px"
                            label-position="right"
                            @submit.native.prevent>
                            <el-form-item class="el-wallet-style" label="主队让球">
                                <el-input
                                    auto-complete="off"
                                    v-model="configData.hConcedePoints"
                                    @input.native="inputValue1"
                                    maxlength="2"
                                >
                                </el-input>
                            </el-form-item>

                            <el-form-item class="el-wallet-style" :label="$t('thevisitingteammadetheball')">
                                <el-input
                                    auto-complete="off"
                                    v-model="configData.vConcedePoints"
                                    @input.native="inputValue2"
                                    maxlength="2"
                                >
                                </el-input>
                            </el-form-item>

                            <el-form-item class="el-wallet-style" :label="$t('amountofnoteundersinglenote')">
                                <el-input
                                    auto-complete="off"
                                    v-model="configData.singleBetCoin"
                                    maxlength="5"
                                >
                                </el-input>
                            </el-form-item>
                            <el-form-item class="el-wallet-style" :label="$t('betscutofftime')">
                                <el-date-picker
                                    style="width: 100%;"
                                    v-model="configData.deadline"
                                    type="datetime"
                                    :placeholder="$t('cutofftime')">
                                </el-date-picker>
                            </el-form-item>
                        </el-form>
                    </el-col>

                    <el-col :span="8">
                        <el-form
                            label-width="150px"
                            label-position="right"
                            @submit.native.prevent>

                            <el-form-item class="el-wallet-style" :label="$t('mainwinningodds')">
                                <el-input
                                    auto-complete="off"
                                    v-model="configData.oddsH"
                                    maxlength="5"
                                >
                                </el-input>
                            </el-form-item>

                            <el-form-item class="el-wallet-style" :label="$t('oddsratio')">
                                <el-input
                                    auto-complete="off"
                                    v-model="configData.oddsD"
                                    maxlength="5"
                                >
                                </el-input>
                            </el-form-item>

                            <el-form-item class="el-wallet-style" :label="$t('winningodds')">
                                <el-input
                                    auto-complete="off"
                                    v-model="configData.oddsV"
                                    maxlength="5"
                                >
                                </el-input>
                            </el-form-item>

                            <!--<el-form-item class="el-wallet-style" label="自定义图标">-->
                            <!--<el-input-->
                            <!--auto-complete="off"-->
                            <!--v-model="configData.icon"-->
                            <!--&gt;-->
                            <!--</el-input>-->
                            <!--</el-form-item>-->
                        </el-form>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col :offset="2" :span="20">
                <div class="explain">
                    <shijiebei-rule></shijiebei-rule>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import shijiebeiRule from "./shijiebeiRule";
    import contract from "../../../contracts/saishijingcai/playGame.json";
    import sol from "../../../contracts/saishijingcai/playGame.sol";

    export default {
        name: "shijiebeiConfig",
        components: {
            shijiebeiRule
        },
        data() {
            return {
                configData: {
                    name: '',
                    type: "",
                    recharge: "",
                    deadline: "",
                    icon: "",
                    singleBetCoin: 1,
                    oddsH: "",
                    oddsD: "",
                    oddsV: "",
                    hConcedePoints: 0,
                    vConcedePoints: 0,
                    id: ""
                },
                types: {},
                gameData: {},
                totalData: {}
            };
        },
        methods: {
            setDefaultDeadline() {
                this.configData.deadline = new Date(
                    this.gameData[this.configData.id].gameTime
                );
            },
            setSession(type) {
                this.configData.id = this.configData.deadline = "";
                this.gameData = {};
                this.gameData = this.totalData[type];
            },
            deploy() {
                let user = this.$store.state.address;
                return new Promise((resolve, reject) => {
                    let result = this.verifyData();
                    if (result.message) {
                        reject(result);
                        return;
                    }
                    let hTeam, vTeam, liveId;
                    hTeam = this.gameData[this.configData.id].zhuTeam;
                    vTeam = this.gameData[this.configData.id].keTeam;
                    liveId = Number(this.gameData[this.configData.id].liveId);
                    try {
                        this.$store.commit("setCryptPercent", {
                            percent: true,
                            text: this.$t("creation")
                        });
                        this.$funs
                            .unlockAccount()
                            .then(res => {
                                let args = [
                                    String(this.configData.name.trim()) || this.$t("competitionguessing02"),
                                    hTeam,
                                    vTeam,
                                    Number(this.configData.oddsH) * 100,
                                    Number(this.configData.oddsD) * 100,
                                    Number(this.configData.oddsV) * 100,
                                    Date.parse(new Date(this.configData.deadline)),
                                    Number(this.configData.singleBetCoin),
                                    Number(this.configData.hConcedePoints),
                                    Number(this.configData.vConcedePoints),
                                    Number(liveId)
                                ];
                                this.$funs.magrationContract(user, contract, sol, args).then(
                                    contractIns => {
                                        this.$store.commit("setCryptPercent", {
                                            percent: true,
                                            text: this.$t("createsuccessrecharge02")
                                        });
                                        this.$funs
                                            .rechargeToContract(
                                                contractIns,
                                                user,
                                                this.configData.recharge
                                            )
                                            .then(
                                                data => {
                                                    contractIns.contractAddressUrl = `/quiz/?${contractIns._address}`;
                                                    resolve(contractIns);
                                                },
                                                err => {
                                                    console.log(err);
                                                }
                                            );
                                    },
                                    err => {
                                        console.log(err);
                                    }
                                );
                            })
                            .catch(reason => {
                                console.log(reason);
                            });
                    } catch (err) {
                        this.$message.error(err.message);
                    }
                });
            },
            verifyData() {
                let balance = Number(this.$store.state.balance);
                // if (!this.configData.name) {
                //   return new Error(this.$t('entergamename'));
                // }
                if (!this.configData.type) {
                    return new Error(this.$t('pleasechoosethetypeofevent01'));
                }
                if (!this.configData.id && this.configData.id != 0) {
                    return new Error(this.$t('pleasechoosethegame'));
                }
                if (!this.$funs.validateFloatNum(this.configData.recharge)) {
                    return new Error(this.$t('enterthecorrectamountofthepool'));
                }
                let reg = /^\d*.\d{0,9}$/g;
                if (!reg.test(this.configData.recharge)) {
                    return new Error(this.$t('thesumofthesumscannotexceed9'));
                }
                if (balance < Number(this.configData.recharge) + 1) {
                    return new Error(this.$t('balanceisnotenoughtopay01'));
                }
                if (
                    (!this.$funs.validateIntNum(this.configData.hConcedePoints) &&
                        this.configData.hConcedePoints != 0) ||
                    (!this.$funs.validateIntNum(this.configData.vConcedePoints) &&
                        this.configData.vConcedePoints != 0)
                ) {
                    return new Error(this.$t('inputpositiveintegerball'));
                }
                if (!this.$funs.validateIntNum(this.configData.singleBetCoin)) {
                    return new Error(this.$t('inputpositiveintegersum'));
                }
                if (!this.configData.deadline) {
                    return new Error(this.$t('choosethebetscutofftime'));
                }
                let now = new Date();
                if (this.configData.deadline < now) {
                    return new Error(this.$t('afterthecurrenttimeofthedeadline'));
                }
                if (
                    this.configData.deadline >
                    new Date(this.gameData[this.configData.id].gameTime)
                ) {
                    return new Error(this.$t('thedeadlineisbeforethestartofthegame'));
                }
                if (
                    !this.$funs.validateFloatNum(this.configData.oddsH) ||
                    !this.$funs.validateFloatNum(this.configData.oddsD) ||
                    !this.$funs.validateFloatNum(this.configData.oddsV)
                ) {
                    return new Error(this.$t('entertherightodds'));
                }
                if (
                    this.splitString(this.configData.oddsH, ".", 1).length > 2 ||
                    this.splitString(this.configData.oddsD, ".", 1).length > 2 ||
                    this.splitString(this.configData.oddsV, ".", 1).length > 2
                ) {
                    return new Error(this.$t('nomorethan2bitsaftertheodds'));
                }
                return true;
            },
            inputValue1() {
                this.configData.vConcedePoints = 0;
            },
            inputValue2() {
                this.configData.hConcedePoints = 0;
            },
            splitString(str, point, n) {
                return String(str).split(point)[n] || "";
            }
        },
        created() {
            this.$axios
                .post("/api/getResults.php")
                .then(res => {
                    if (res.data.code == 200) {
                        let result = res.data.result;
                        let len = result.length;
                        if (result.length) {
                            this.types = {};
                            this.totalData = {};
                            for (let i = 0; i < len; i++) {
                                if (result[i].type === this.$t('notopening')) {
                                    let name = result[i].name;
                                    if (!this.types[name]) {
                                        this.types[name] = name;
                                        this.totalData[name] = [];
                                    }
                                    this.totalData[name].push(result[i]);
                                }
                            }
                        } else {
                            this.$message.error(this.$t('therearenogamesinprogressatthemoment'));
                        }
                    }
                })
                .catch(error => {
                    this.$message.error(String(error));
                });
        },
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/gameConfig";
</style>
