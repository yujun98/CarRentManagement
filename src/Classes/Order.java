package Classes;

//订单类
public class Order {
    //订单编号
    private String order_number;
    //用户手机号
    private String user_phone;
    //汽车编号
    private String car_number;
    //取车服务点编号
    private String take_shop;
    //还车服务点编号
    private String return_shop;
    //取车时间
    private String take_time;
    //还车时间
    private String return_time;
    //订单金额
    private float order_amount;
    //订单状态
    private String order_state;
    //取车前剩余油量
    private float take_oil;
    //还车后剩余油量
    private float return_oil;
    //油量补偿花费
    private float oil_amount;
    //下订单时间
    private String order_time;

    public void setOrder_number(String order_number) {
        this.order_number = order_number;
    }
    public void setUser_phone(String user_phone) {
        this.user_phone = user_phone;
    }
    public void setCar_number(String car_number) {
        this.car_number = car_number;
    }
    public void setTake_shop(String take_shop) {
        this.take_shop = take_shop;
    }
    public void setReturn_shop(String return_shop) {
        this.return_shop = return_shop;
    }
    public void setTake_time(String take_time) {
        this.take_time = take_time;
    }
    public void setReturn_time(String return_time) {
        this.return_time = return_time;
    }
    public void setOrder_amount(float order_amount) {
        this.order_amount = order_amount;
    }
    public void setOrder_state(String order_state) {
        this.order_state = order_state;
    }
    public void setTake_oil(float take_oil) {
        this.take_oil = take_oil;
    }
    public void setReturn_oil(float return_oil) {
        this.return_oil = return_oil;
    }
    public void setOil_amount(float oil_amount) {
        this.oil_amount = oil_amount;
    }
    public void setOrder_time(String order_time) {
        this.order_time = order_time;
    }

    public String getOrder_number() {
        return order_number;
    }
    public String getUser_phone() {
        return user_phone;
    }
    public String getCar_number() {
        return car_number;
    }
    public String getTake_shop() {
        return take_shop;
    }
    public String getReturn_shop() {
        return return_shop;
    }
    public String getTake_time() {
        return take_time;
    }
    public String getReturn_time() {
        return return_time;
    }
    public float getOrder_amount() {
        return order_amount;
    }
    public String getOrder_state() {
        return order_state;
    }
    public float getTake_oil() {
        return take_oil;
    }
    public float getReturn_oil() {
        return return_oil;
    }
    public float getOil_amount() {
        return oil_amount;
    }
    public String getOrder_time() {
        return order_time;
    }
}
