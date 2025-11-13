import { Card, CardBody, Col, Container, Row } from "reactstrap";
import DragCalendar from "./components/calendar/DragCalendar";
import { Meeting } from "@/features/meeting/meetingApiSlice";

type CalenderPresentationProps = {
  meetings: Meeting[] | undefined;
};
const CalenderPresentation: React.FC<CalenderPresentationProps> = ({
  meetings,
}) => {
  return (
    <>
      <Container fluid className="calendar-basic">
        <Row>
          <Col sm={12}>
            <Card className="calendar-default">
              <CardBody>
                <Row>
                  <DragCalendar meetings={meetings} />
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CalenderPresentation;
