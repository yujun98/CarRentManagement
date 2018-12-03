package Classes;

public class User {
    //用户电话号码
    private String user_phone;
    //用户昵称
    private String user_name;
    //用户密码
    private String user_pwd;
    //用户身份证号
    private String id;
    //用户状态：是否认证
    private int state;
    //用户余额
    private int balance;
    //用户押金
    private int deposit;
    //用户积分
    private int score;

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
    public void setState(int state) {
        this.state = state;
    }
    public void setBalance(int balance) {
        this.balance = balance;
    }
    public void setDeposit(int deposit) {
        this.deposit = deposit;
    }
    public void setScore(int score) {
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
    public int getState() {
        return state;
    }
    public int getBalance() {
        return balance;
    }
    public int getDeposit() {
        return deposit;
    }
    public int getScore() {
        return score;
    }
}
