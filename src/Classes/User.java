package Classes;

//用户类
public class User {
    //用户电话号码
    private String user_phone;
    //用户昵称
    private String user_name;
    //用户密码
    private String user_pwd;
    //用户身份证号
    private String id;
    //用户余额
    private float balance;
    //用户押金
    private float deposit;
    //用户积分
    private float score;

    public void setUser_phone(String user_phone) {
        this.user_phone = user_phone;
    }
    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }
    public void setUser_pwd(String user_pwd) {
        this.user_pwd = user_pwd;
    }
    public void setId(String id) {
        this.id = id;
    }
    public void setBalance(float balance) {
        this.balance = balance;
    }
    public void setDeposit(float deposit) {
        this.deposit = deposit;
    }
    public void setScore(float score) {
        this.score = score;
    }

    public String getUser_phone() {
        return user_phone;
    }
    public String getUser_name() {
        return user_name;
    }
    public String getUser_pwd() {
        return user_pwd;
    }
    public String getId() {
        return id;
    }
    public float getBalance() {
        return balance;
    }
    public float getDeposit() {
        return deposit;
    }
    public float getScore() {
        return score;
    }
}
