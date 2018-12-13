package Classes;

public class Peccancy {
    //订单编号
    private String order_number;
    //罚款金额
    private float amount;
    //违章类型
    private String type;

    public void setOrder_number(String order_number) {
        this.order_number = order_number;
    }
    public void setAmount(float amount) {
        this.amount = amount;
    }
    public void setType(String type) {
        this.type = type;
    }

    public String getOrder_number() {
        return order_number;
    }
    public float getAmount() {
        return amount;
    }
    public String getType() {
        return type;
    }
}
